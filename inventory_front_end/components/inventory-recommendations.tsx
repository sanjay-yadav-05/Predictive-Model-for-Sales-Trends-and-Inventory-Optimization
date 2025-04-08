"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"

interface InventoryRecommendationsProps {
  recommendations: any[]
}

export function InventoryRecommendations({ recommendations }: InventoryRecommendationsProps) {
  const [search, setSearch] = useState("")

  // Filter recommendations based on search
  const filteredRecommendations = recommendations.filter((item) => {
    if (!search) return true

    // Search in InventoryId and Description
    return (
      item.InventoryId.toString().toLowerCase().includes(search.toLowerCase()) ||
      item.Description.toLowerCase().includes(search.toLowerCase()) ||
      item.Status.toLowerCase().includes(search.toLowerCase()) ||
      item.Action.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Function to export data as CSV
  const exportCSV = () => {
    if (recommendations.length === 0) return

    const headers = Object.keys(recommendations[0])
    const csvContent = [
      headers.join(","),
      ...recommendations.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle values with commas by wrapping in quotes
            return value !== undefined && value !== null ? `"${value.toString().replace(/"/g, '""')}"` : ""
          })
          .join(","),
      ),
    ].join("\n")

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.download = "inventory_recommendations.csv"

    // Append the link to the document body
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  }

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "URGENT_RESTOCK":
        return <Badge variant="destructive">Urgent Restock</Badge>
      case "REORDER":
        return <Badge variant="warning">Reorder</Badge>
      case "OK":
        return (
          <Badge variant="outline" className="bg-green-100">
            OK
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Inventory Recommendations</CardTitle>
            <CardDescription>Detailed recommendations for each inventory item</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={exportCSV} title="Export as CSV">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Predicted Demand</TableHead>
                  <TableHead>Safety Stock</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecommendations.length > 0 ? (
                  filteredRecommendations.map((item) => (
                    <TableRow key={item.InventoryId}>
                      <TableCell>{item.InventoryId}</TableCell>
                      <TableCell>{item.Description}</TableCell>
                      <TableCell>{item.Current_Stock}</TableCell>
                      <TableCell>{item.Predicted_Demand}</TableCell>
                      <TableCell>{item.Safety_Stock}</TableCell>
                      <TableCell>{item.Reorder_Point}</TableCell>
                      <TableCell>{getStatusBadge(item.Status)}</TableCell>
                      <TableCell>{item.Action}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
