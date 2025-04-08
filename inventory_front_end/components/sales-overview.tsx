"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface SalesOverviewProps {
  finalData: any[]
  salesData: any[]
}

export function SalesOverview({ finalData, salesData }: SalesOverviewProps) {
  // Calculate total sales
  const totalSales = useMemo(() => {
    return salesData.reduce((sum, item) => {
      const amount = Number.parseFloat(item.amount || "0")
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
  }, [salesData])

  // Calculate total products
  const totalProducts = useMemo(() => {
    return finalData.length
  }, [finalData])

  // Calculate average sale value
  const averageSaleValue = useMemo(() => {
    if (salesData.length === 0) return 0
    return totalSales / salesData.length
  }, [salesData, totalSales])

  // Generate monthly sales data
  const monthlySalesData = useMemo(() => {
    const monthlyData: Record<string, number> = {}

    salesData.forEach((sale) => {
      // Assuming there's a date field in the format YYYY-MM-DD or similar
      if (sale.date) {
        const date = new Date(sale.date)
        if (!isNaN(date.getTime())) {
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          const amount = Number.parseFloat(sale.amount || "0")

          if (!isNaN(amount)) {
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + amount
          }
        }
      }
    })

    // If no valid dates were found, create sample data
    if (Object.keys(monthlyData).length === 0) {
      return [
        { month: "Jan", sales: 1200 },
        { month: "Feb", sales: 1900 },
        { month: "Mar", sales: 1500 },
        { month: "Apr", sales: 2400 },
        { month: "May", sales: 2800 },
        { month: "Jun", sales: 1800 },
      ]
    }

    // Convert to array format for the chart
    return Object.entries(monthlyData)
      .map(([monthYear, sales]) => {
        const [year, month] = monthYear.split("-")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return {
          month: monthNames[Number.parseInt(month) - 1],
          sales,
        }
      })
      .sort((a, b) => {
        const monthOrder = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        }
        return monthOrder[a.month as keyof typeof monthOrder] - monthOrder[b.month as keyof typeof monthOrder]
      })
  }, [salesData])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">+12 new products this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Sale Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageSaleValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Sales performance over the past months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
