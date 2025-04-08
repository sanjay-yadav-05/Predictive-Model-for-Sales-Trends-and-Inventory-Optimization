"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesOverview } from "@/components/sales-overview"
import { ProductPerformance } from "@/components/product-performance"
import { SalesTrends } from "@/components/sales-trends"
import { DataTable } from "@/components/data-table"

export function AnalyticsDashboard() {
  const [finalData, setFinalData] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Retrieve data from localStorage
      const storedFinalData = localStorage.getItem("finalData")
      const storedSalesData = localStorage.getItem("salesData")

      if (!storedFinalData || !storedSalesData) {
        setError("No data found. Please upload files first.")
        setIsLoading(false)
        return
      }

      setFinalData(JSON.parse(storedFinalData))
      setSalesData(JSON.parse(storedSalesData))
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Go back to upload page
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sales Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive analysis of your sales data</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Product Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Sales Trends
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <span className="h-4 w-4 grid place-items-center">📊</span>
            Raw Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <SalesOverview finalData={finalData} salesData={salesData} />
        </TabsContent>

        <TabsContent value="products" className="space-y-8">
          <ProductPerformance finalData={finalData} salesData={salesData} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-8">
          <SalesTrends finalData={finalData} salesData={salesData} />
        </TabsContent>

        <TabsContent value="data" className="space-y-8">
          <DataTable finalData={finalData} salesData={salesData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
