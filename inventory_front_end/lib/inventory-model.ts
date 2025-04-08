export class InventoryModel {
  // This is a simplified version of the Python model for client-side use

  preprocessData(finalData: any[], salesData: any[]) {
    console.log("Preprocessing data...")

    // Convert string values to numbers
    finalData = finalData.map((item) => {
      const numericItem: Record<string, any> = {}
      Object.keys(item).forEach((key) => {
        const value = item[key]
        numericItem[key] = isNaN(Number(value)) ? value : Number(value)
      })
      return numericItem
    })

    salesData = salesData.map((item) => {
      const numericItem: Record<string, any> = {}
      Object.keys(item).forEach((key) => {
        if (key === "SalesDate") {
          numericItem[key] = item[key]
        } else {
          const value = item[key]
          numericItem[key] = isNaN(Number(value)) ? value : Number(value)
        }
      })
      return numericItem
    })

    // Calculate sales metrics from sales data
    const salesMetrics: Record<string, any> = {}

    salesData.forEach((sale) => {
      const id = sale.InventoryId

      if (!salesMetrics[id]) {
        salesMetrics[id] = {
          TotalSalesQuantity: 0,
          SalesQuantities: [],
          SalesPrices: [],
          TotalSalesDollars: 0,
        }
      }

      salesMetrics[id].TotalSalesQuantity += sale.SalesQuantity
      salesMetrics[id].SalesQuantities.push(sale.SalesQuantity)
      salesMetrics[id].SalesPrices.push(sale.SalesPrice)
      salesMetrics[id].TotalSalesDollars += sale.SalesDollars
    })

    // Calculate statistics
    Object.keys(salesMetrics).forEach((id) => {
      const metrics = salesMetrics[id]

      // Calculate mean and standard deviation
      metrics.AvgSalesQuantity = this.mean(metrics.SalesQuantities)
      metrics.StdSalesQuantity = this.standardDeviation(metrics.SalesQuantities)
      metrics.AvgSalesPrice = this.mean(metrics.SalesPrices)
      metrics.StdSalesPrice = this.standardDeviation(metrics.SalesPrices)

      // Clean up temporary arrays
      delete metrics.SalesQuantities
      delete metrics.SalesPrices
    })

    // Merge with final dataset
    const mergedData = finalData.map((item) => {
      const id = item.InventoryId
      const metrics = salesMetrics[id] || {
        TotalSalesQuantity: 0,
        AvgSalesQuantity: 0,
        StdSalesQuantity: 0,
        AvgSalesPrice: 0,
        StdSalesPrice: 0,
        TotalSalesDollars: 0,
      }

      // Calculate additional features
      const daysOfStock = metrics.AvgSalesQuantity > 0 ? item.onHand_end / metrics.AvgSalesQuantity : 0

      const profitMargin = item.AvgPrice > 0 ? (item.AvgPrice - item.PurchasePrice) / item.AvgPrice : 0

      const salesVariability = metrics.AvgSalesQuantity > 0 ? metrics.StdSalesQuantity / metrics.AvgSalesQuantity : 0

      return {
        ...item,
        ...metrics,
        DaysOfStock: daysOfStock,
        ProfitMargin: profitMargin,
        SalesVariability: salesVariability,
      }
    })

    return mergedData
  }

  predictDemand(processedData: any[]) {
    console.log("Predicting demand...")

    // This is a simplified prediction model
    // In a real application, you would use a trained ML model
    // For now, we'll use a simple heuristic based on sales data

    return processedData.map((item) => {
      // Base prediction on average sales with some adjustments
      let prediction = item.AvgSalesQuantity || 0

      // Adjust based on profit margin (higher margin items might sell less)
      prediction *= 1 - item.ProfitMargin * 0.1

      // Adjust based on sales variability (higher variability means less predictable)
      prediction *= 1 + item.SalesVariability * 0.2

      // Ensure prediction is positive
      return Math.max(1, Math.round(prediction))
    })
  }

  generateRecommendations(processedData: any[], predictions: number[]) {
    console.log("Generating recommendations...")

    const recommendations = processedData.map((item, idx) => {
      const currentStock = item.onHand_end
      const predictedDemand = Math.floor(predictions[idx])
      const leadTime = item.LeadTime
      const safetyStock = Math.floor(predictedDemand * leadTime * 0.2) // 20% safety factor
      const reorderPoint = Math.floor(predictedDemand * leadTime + safetyStock)

      let status, action

      if (currentStock < safetyStock) {
        status = "URGENT_RESTOCK"
        action = `Order ${reorderPoint - currentStock} units immediately`
      } else if (currentStock < reorderPoint) {
        status = "REORDER"
        action = `Plan to order ${reorderPoint - currentStock} units`
      } else {
        status = "OK"
        action = "No action needed"
      }

      return {
        InventoryId: item.InventoryId,
        Description: item.Description,
        Current_Stock: currentStock,
        Predicted_Demand: predictedDemand,
        Safety_Stock: safetyStock,
        Reorder_Point: reorderPoint,
        Status: status,
        Action: action,
      }
    })

    return recommendations
  }

  // Helper functions for statistics
  mean(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  standardDeviation(values: number[]): number {
    if (values.length <= 1) return 0

    const avg = this.mean(values)
    const squareDiffs = values.map((value) => Math.pow(value - avg, 2))
    const avgSquareDiff = this.mean(squareDiffs)
    return Math.sqrt(avgSquareDiff)
  }
}
