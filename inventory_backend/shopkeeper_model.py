import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os
import math

class ShopkeeperInventoryModel:
    def __init__(self, model_path='models'):
        self.model = joblib.load(f'{model_path}/demand_model.joblib')
        self.scaler = joblib.load(f'{model_path}/scaler.joblib')
        self.feature_info = joblib.load(f'{model_path}/model_info.joblib')
        self.feature_columns = self.feature_info['feature_columns']
        
    def load_test_data(self, final_data_path, sales_data_path):
        final_data = pd.read_csv(final_data_path)
        sales_data = pd.read_csv(sales_data_path)
        sales_data['SalesDate'] = pd.to_datetime(sales_data['SalesDate'])
        return final_data, sales_data
    
    def preprocess_test_data(self, final_data, sales_data):
        sales_metrics = sales_data.groupby('InventoryId').agg({
            'SalesQuantity': ['sum', 'mean', 'std'],
            'SalesPrice': ['mean', 'std'],
            'SalesDollars': 'sum'
        }).reset_index()
        
        sales_metrics.columns = ['InventoryId', 'TotalSalesQuantity', 'AvgSalesQuantity', 
                                 'StdSalesQuantity', 'AvgSalesPrice', 'StdSalesPrice', 
                                 'TotalSalesDollars']
        
        merged_data = pd.merge(final_data, sales_metrics, on='InventoryId', how='left')
        merged_data['DaysOfStock'] = np.where(
            merged_data['AvgSalesQuantity'] > 0,
            merged_data['onHand_end'] / merged_data['AvgSalesQuantity'],
            0
        )
        merged_data['ProfitMargin'] = np.where(
            merged_data['AvgPrice'] > 0,
            (merged_data['AvgPrice'] - merged_data['PurchasePrice']) / merged_data['AvgPrice'],
            0
        )
        merged_data['SalesVariability'] = np.where(
            merged_data['AvgSalesQuantity'] > 0,
            merged_data['StdSalesQuantity'] / merged_data['AvgSalesQuantity'],
            0
        )
        
        merged_data.replace([np.inf, -np.inf], 0, inplace=True)
        merged_data.fillna(0, inplace=True)
        
        for col in ['TotalSalesDollars', 'PurchasePrice', 'Quantity']:
            if col in merged_data.columns:
                merged_data[col] = merged_data[col] / 1000
        
        return merged_data
    
    def predict_demand(self, test_data):
        X = test_data[self.feature_columns].copy().astype(np.float32)
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        return predictions
    
    def generate_recommendations(self, test_data, predictions):
        recommendations = []
        for idx, row in test_data.iterrows():
            current_stock = row['onHand_end']
            predicted_demand = math.floor(predictions[idx])
            lead_time = row['LeadTime']
            safety_stock = math.floor(predicted_demand * lead_time * 0.2)
            reorder_point = math.floor(predicted_demand * lead_time + safety_stock)
            
            if current_stock < safety_stock:
                status = "URGENT_RESTOCK"
                action = f"Order {reorder_point - current_stock:.0f} units immediately"
            elif current_stock < reorder_point:
                status = "REORDER"
                action = f"Plan to order {reorder_point - current_stock:.0f} units"
            else:
                status = "OK"
                action = "No action needed"
            
            recommendations.append({
                'InventoryId': row['InventoryId'],
                'Description': row['Description'],
                'Current_Stock': current_stock,
                'Predicted_Demand': predicted_demand,
                'Safety_Stock': safety_stock,
                'Reorder_Point': reorder_point,
                'Status': status,
                'Action': action
            })
        
        return pd.DataFrame(recommendations)
    
    def visualize_results(self, recommendations):
        fig, axs = plt.subplots(2, 2, figsize=(18, 12))
        fig.suptitle('Inventory Analysis Results', fontsize=16)

        sns.barplot(data=recommendations, x='InventoryId', y='Current_Stock', ax=axs[0, 0])
        axs[0, 0].set_title('Current Stock Levels')
        axs[0, 0].tick_params(axis='x', rotation=45)

        for idx, row in recommendations.iterrows():
            msg = row['Action'].split(" ")[0] if row['Status'] != "OK" else "No Action"
            axs[0, 0].text(idx, row['Current_Stock'] + 0.5, msg, ha='center', fontsize=9, color='red', rotation=90)

        sns.barplot(data=recommendations, x='InventoryId', y='Predicted_Demand', ax=axs[0, 1])
        axs[0, 1].set_title('Predicted Demand')
        axs[0, 1].tick_params(axis='x', rotation=45)

        x = np.arange(len(recommendations['InventoryId']))
        width = 0.35
        axs[1, 0].bar(x - width/2, recommendations['Current_Stock'], width, label='Current Stock')
        axs[1, 0].bar(x + width/2, recommendations['Safety_Stock'], width, label='Safety Stock')
        axs[1, 0].set_xticks(x)
        axs[1, 0].set_xticklabels(recommendations['InventoryId'], rotation=45)
        axs[1, 0].legend()
        axs[1, 0].set_title('Current Stock vs Safety Stock')

        status_counts = recommendations['Status'].value_counts()
        axs[1, 1].pie(status_counts, labels=status_counts.index, autopct='%1.1f%%', startangle=90, shadow=True)
        axs[1, 1].set_title('Inventory Status Distribution')

        plt.tight_layout(rect=[0, 0.03, 1, 0.95])
        return fig

    def analyze_inventory(self, final_data_path, sales_data_path):
        final_data, sales_data = self.load_test_data(final_data_path, sales_data_path)
        processed_data = self.preprocess_test_data(final_data, sales_data)
        predictions = self.predict_demand(processed_data)
        recommendations = self.generate_recommendations(processed_data, predictions)
        os.makedirs('output', exist_ok=True)
        recommendations.to_csv('output/inventory_recommendations.csv', index=False)
        plot = self.visualize_results(recommendations)
        plot.savefig('output/inventory_analysis.png')
        return recommendations

# 👇 Wrapper to call from FastAPI
def run_inventory_analysis(final_path, sales_path):
    model = ShopkeeperInventoryModel()
    return model.analyze_inventory(final_path, sales_path)
