"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface InventoryVisualizationsProps {
  recommendations: any[]
}

export function InventoryVisualizations({ recommendations }: InventoryVisualizationsProps) {
  // Limit the number of items to display to prevent performance issues
  const limitedRecommendations = useMemo(() => {
    // return recommendations.slice(0, 10) // Only show first 10 items
    return recommendations // Only show first 10 items
  }, [recommendations])

  // Prepare data for Current Stock Levels chart
  const stockLevelsData = useMemo(() => {
    return limitedRecommendations.map((item) => ({
      name: item.InventoryId,
      description: item.Description,
      currentStock: item.Current_Stock,
      safetyStock: item.Safety_Stock,
      reorderPoint: item.Reorder_Point,
      status: item.Status,
    }))
  }, [limitedRecommendations])

  // Prepare data for Predicted Demand chart
  const demandData = useMemo(() => {
    return limitedRecommendations.map((item) => ({
      name: item.InventoryId,
      description: item.Description,
      predictedDemand: item.Predicted_Demand,
    }))
  }, [limitedRecommendations])

  // Prepare data for Current Stock vs Safety Stock chart
  const stockComparisonData = useMemo(() => {
    return limitedRecommendations.map((item) => ({
      name: item.InventoryId,
      description: item.Description,
      currentStock: item.Current_Stock,
      predictedDemand: item.Predicted_Demand,
    }))
  }, [limitedRecommendations])

  // Prepare data for Status Distribution pie chart
  const statusDistributionData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      URGENT_RESTOCK: 0,
      REORDER: 0,
      OK: 0,
    }

    recommendations.forEach((item) => {
      statusCounts[item.Status] += 1
    })

    return [
      { name: "Urgent Restock", value: statusCounts["URGENT_RESTOCK"] || 0 },
      { name: "Reorder", value: statusCounts["REORDER"] || 0 },
      { name: "OK", value: statusCounts["OK"] || 0 },
    ]
  }, [recommendations])

  const COLORS = ["#FF8042", "#FFBB28", "#00C49F"]
  const STATUS_COLORS = {
    URGENT_RESTOCK: "#ef4444",
    REORDER: "#f59e0b",
    OK: "#10b981",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
          <CardDescription>Current stock with reorder annotations </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockLevelsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "Current Stock"
                      ? "Current Stock"
                      : name === "Safety Stock"
                        ? "Safety Stock"
                        : "Reorder Point",
                  ]}
                  labelFormatter={(label) => {
                    const item = stockLevelsData.find((item) => item.name === label)
                    return `${label}: ${item?.description}`
                  }}
                />
                <Legend />
                <Bar dataKey="currentStock" name="Current Stock" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="safetyStock" name="Safety Stock" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reorderPoint" name="Reorder Point" fill="#ffc658" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predicted Demand</CardTitle>
          <CardDescription>Predicted demand for each inventory item </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demandData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, "Predicted Demand"]}
                  labelFormatter={(label) => {
                    const item = demandData.find((item) => item.name === label)
                    return `${label}: ${item?.description}`
                  }}
                />
                <Legend />
                <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock vs predicted Demand</CardTitle>
          <CardDescription>Comparison of current stock levels to predicted Demand </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockComparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name === "currentStock" ? "Current Stock" : "predicted Demand"]}
                  labelFormatter={(label) => {
                    const item = stockComparisonData.find((item) => item.name === label)
                    return `${label}: ${item?.description}`
                  }}
                />
                <Legend />
                <Bar dataKey="currentStock" name="Current Stock" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictedDemand" name="predicted Demand" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Status Distribution</CardTitle>
          <CardDescription>Distribution of inventory status categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Urgent Restock"
                          ? STATUS_COLORS["URGENT_RESTOCK"]
                          : entry.name === "Reorder"
                            ? STATUS_COLORS["REORDER"]
                            : STATUS_COLORS["OK"]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Items"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
