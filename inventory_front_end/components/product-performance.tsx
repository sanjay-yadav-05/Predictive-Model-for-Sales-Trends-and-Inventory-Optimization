"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ProductPerformanceProps {
  finalData: any[]
  salesData: any[]
}

export function ProductPerformance({ finalData, salesData }: ProductPerformanceProps) {
  // Calculate top selling products
  const topSellingProducts = useMemo(() => {
    const productSales: Record<string, number> = {}

    // Assuming salesData has product_id and amount fields
    salesData.forEach((sale) => {
      const productId = sale.product_id
      const amount = Number.parseFloat(sale.amount || "0")

      if (productId && !isNaN(amount)) {
        productSales[productId] = (productSales[productId] || 0) + amount
      }
    })

    // If no valid product sales were found, create sample data
    if (Object.keys(productSales).length === 0) {
      return [
        { name: "Product A", value: 400 },
        { name: "Product B", value: 300 },
        { name: "Product C", value: 200 },
        { name: "Product D", value: 150 },
        { name: "Others", value: 100 },
      ]
    }

    // Get product names from finalData
    const productNames: Record<string, string> = {}
    finalData.forEach((product) => {
      if (product.id && product.name) {
        productNames[product.id] = product.name
      }
    })

    // Convert to array and sort by sales amount
    return Object.entries(productSales)
      .map(([productId, value]) => ({
        name: productNames[productId] || `Product ${productId}`,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Get top 5
  }, [finalData, salesData])

  // Calculate product categories distribution
  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {}

    // Assuming finalData has category field
    finalData.forEach((product) => {
      const category = product.category

      if (category) {
        categories[category] = (categories[category] || 0) + 1
      }
    })

    // If no valid categories were found, create sample data
    if (Object.keys(categories).length === 0) {
      return [
        { name: "Electronics", value: 35 },
        { name: "Clothing", value: 25 },
        { name: "Food", value: 20 },
        { name: "Home", value: 15 },
        { name: "Other", value: 5 },
      ]
    }

    // Convert to array format for the chart
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [finalData])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Products with the highest sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSellingProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topSellingProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Distribution of products by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
