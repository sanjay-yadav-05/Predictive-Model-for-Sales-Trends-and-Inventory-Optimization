"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

interface InventoryOverviewProps {
  recommendations: any[]
}

export function InventoryOverview({ recommendations }: InventoryOverviewProps) {
  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalItems = recommendations.length
    const totalStock = recommendations.reduce((sum, item) => sum + (Number(item.Current_Stock) || 0), 0)

    const urgentCount = recommendations.filter((item) => item.Status === "URGENT_RESTOCK").length
    const reorderCount = recommendations.filter((item) => item.Status === "REORDER").length
    const okCount = recommendations.filter((item) => item.Status === "OK").length

    const totalPredictedDemand = recommendations.reduce((sum, item) => sum + (Number(item.Predicted_Demand) || 0), 0)

    return {
      totalItems,
      totalStock,
      urgentCount,
      reorderCount,
      okCount,
      totalPredictedDemand,
    }
  }, [recommendations])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Items</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Unique products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Current Stock</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total units in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Demand</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPredictedDemand.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total predicted demand units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Needing Action</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.urgentCount + stats.reorderCount).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Items requiring restock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Summary of inventory status recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Urgent Restock</span>
                </div>
                <Badge variant="destructive">{stats.urgentCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  <span>Reorder Soon</span>
                </div>
                <Badge variant="warning">{stats.reorderCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Adequate Stock</span>
                </div>
                <Badge variant="outline" className="bg-green-100">
                  {stats.okCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Overall inventory health assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Summary</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.urgentCount > 0
                    ? `You have ${stats.urgentCount} items that need immediate attention.`
                    : "All items are adequately stocked."}
                  {stats.reorderCount > 0 && ` Additionally, ${stats.reorderCount} items should be reordered soon.`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Recommendations</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                  {stats.urgentCount > 0 && <li>Place orders for urgent items immediately to avoid stockouts</li>}
                  {stats.reorderCount > 0 && (
                    <li>Plan to reorder items marked for reordering within the next ordering cycle</li>
                  )}
                  <li>Review safety stock levels for items with high demand variability</li>
                  <li>Consider adjusting lead times for frequently stocked out items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
