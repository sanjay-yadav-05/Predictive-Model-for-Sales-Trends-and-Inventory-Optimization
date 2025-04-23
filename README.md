# 🧠 Predictive Model for Sales Trends and Inventory Optimization

This project is designed to help vendors optimize their inventory by analyzing sales data and predicting trends using machine learning. It features a user-friendly web interface to upload datasets and visualize inventory insights.

---

## 📊 Dataset

The model is trained on real-world inventory and sales data from Kaggle:

**🔗 [Inventory Analysis Case Study – Bhanu Pratap Biswas](https://www.kaggle.com/datasets/bhanupratapbiswas/inventory-analysis-case-study)**

This dataset includes product-level details, sales figures, and inventory movement useful for building data-driven inventory optimization solutions.

---

## 🚀 Getting Started

### 📦 Prerequisites

- Python 3.8+
- pip (Python package manager)
- Node.js and npm (for frontend)
- Git

---



## Project Setup: Clone the repository

```bash
git clone https://github.com/sanjay-yadav-05/Predictive-Model-for-Sales-Trends-and-Inventory-Optimization.git
cd Predictive-Model-for-Sales-Trends-and-Inventory-Optimization
```
## ⚙️ Backend Setup

1. **Install Python dependencies**

```bash
pip install -r requirements.txt
```

2. **Run the backend server using FastAPI**

```bash
uvicorn main:app --reload
```

---

## 🌐 Frontend Setup

1. **Navigate to the frontend directory**

```bash
cd inventory_frontend
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

---

## 📁 Upload Required Files

Upload these CSV files using the app interface:
- `test_final_dataset.csv`
- `test_sales_data.csv`

---

## 📊 Output

- ✅ Inventory recommendations saved to `output/inventory_recommendations.csv`
- 📈 Visual insights saved to `output/inventory_analysis.png`

---

## 🧪 Technologies Used

- Python
- Pandas, NumPy, Matplotlib, Scikit-learn
- FastAPI / Flask
- React.js / Next.js
- Tailwind CSS + shadcn/ui
- Git & GitHub

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Sanjay Yadav**  
📫 [GitHub](https://github.com/sanjay-yadav-05)
