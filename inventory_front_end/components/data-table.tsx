"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

interface DataTableProps {
  finalData: any[]
  salesData: any[]
}

export function DataTable({ finalData, salesData }: DataTableProps) {
  const [finalSearch, setFinalSearch] = useState("")
  const [salesSearch, setSalesSearch] = useState("")

  // Filter final data based on search
  const filteredFinalData = finalData.filter((item) => {
    if (!finalSearch) return true

    // Search in all fields
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(finalSearch.toLowerCase()),
    )
  })

  // Filter sales data based on search
  const filteredSalesData = salesData.filter((item) => {
    if (!salesSearch) return true

    // Search in all fields
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(salesSearch.toLowerCase()),
    )
  })

  // Get column headers from the first item
  const finalHeaders = finalData.length > 0 ? Object.keys(finalData[0]) : []
  const salesHeaders = salesData.length > 0 ? Object.keys(salesData[0]) : []

  // Function to export data as CSV
  const exportCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle values with commas by wrapping in quotes
            return value !== undefined && value !== null ? `"${value.toString().replace(/"/g, '""')}"` : ""
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Tabs defaultValue="final" className="space-y-4">
      <TabsList>
        <TabsTrigger value="final">Test Final Data</TabsTrigger>
        <TabsTrigger value="sales">Test Sales Data</TabsTrigger>
      </TabsList>

      <TabsContent value="final">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Test Final Data</CardTitle>
                <CardDescription>Raw data from the test_final file</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={finalSearch}
                    onChange={(e) => setFinalSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => exportCSV(filteredFinalData, "test_final_export.csv")}
                  title="Export as CSV"
                >
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
                      {finalHeaders.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinalData.length > 0 ? (
                      filteredFinalData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {finalHeaders.map((header) => (
                            <TableCell key={`${rowIndex}-${header}`}>
                              {row[header] !== undefined && row[header] !== null ? row[header].toString() : ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={finalHeaders.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sales">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Test Sales Data</CardTitle>
                <CardDescription>Raw data from the test_sales file</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => exportCSV(filteredSalesData, "test_sales_export.csv")}
                  title="Export as CSV"
                >
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
                      {salesHeaders.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalesData.length > 0 ? (
                      filteredSalesData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {salesHeaders.map((header) => (
                            <TableCell key={`${rowIndex}-${header}`}>
                              {row[header] !== undefined && row[header] !== null ? row[header].toString() : ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={salesHeaders.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
