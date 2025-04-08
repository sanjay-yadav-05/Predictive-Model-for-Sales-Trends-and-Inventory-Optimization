"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BarChart, PieChart, TableIcon } from "lucide-react"
import { InventoryOverview } from "@/components/inventory-overview"
import { InventoryRecommendations } from "@/components/inventory-recommendations"
import { InventoryVisualizations } from "@/components/inventory-visualizations"
import Link from "next/link"

export function InventoryDashboard() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Retrieve recommendations from localStorage
      let storedRecommendations

      try {
        storedRecommendations = localStorage.getItem("inventoryRecommendations")
      } catch (e) {
        console.error("Error accessing localStorage:", e)
        setError("Unable to access local storage. Please check your browser settings.")
        setIsLoading(false)
        return
      }

      if (!storedRecommendations) {
        setError("No data found. Please upload files first.")
        setIsLoading(false)
        return
      }

      let parsedRecommendations

      try {
        parsedRecommendations = JSON.parse(storedRecommendations)
      } catch (e) {
        console.error("Error parsing data:", e)
        setError("Invalid data format. Please upload files again.")
        setIsLoading(false)
        return
      }

      // Validate the parsed data
      if (!Array.isArray(parsedRecommendations)) {
        setError("Invalid data format. Please upload files again.")
        setIsLoading(false)
        return
      }

      setRecommendations(parsedRecommendations)
      setIsLoading(false)
    } catch (error) {
      console.error("Error in dashboard:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing inventory data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container  flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Go back to upload page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container m-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Analysis Dashboard</h1>
        <p className="text-muted-foreground">Demand predictions and inventory recommendations</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="visualizations" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Visualizations
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <InventoryOverview recommendations={recommendations} />
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-8">
          <InventoryVisualizations recommendations={recommendations} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-8">
          <InventoryRecommendations recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
