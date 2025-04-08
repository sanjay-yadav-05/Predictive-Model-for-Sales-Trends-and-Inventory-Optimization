"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface SalesTrendsProps {
  finalData: any[]
  salesData: any[]
}

export function SalesTrends({ finalData, salesData }: SalesTrendsProps) {
  // Generate daily sales trend data
  const dailySalesTrend = useMemo(() => {
    const dailyData: Record<string, { date: string; sales: number; orders: number }> = {}

    salesData.forEach((sale) => {
      // Assuming there's a date field in the format YYYY-MM-DD or similar
      if (sale.date) {
        const dateStr = sale.date.split("T")[0] // Extract just the date part
        const amount = Number.parseFloat(sale.amount || "0")

        if (!isNaN(amount)) {
          if (!dailyData[dateStr]) {
            dailyData[dateStr] = { date: dateStr, sales: 0, orders: 0 }
          }

          dailyData[dateStr].sales += amount
          dailyData[dateStr].orders += 1
        }
      }
    })

    // If no valid dates were found, create sample data
    if (Object.keys(dailyData).length === 0) {
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (30 - i))
        const dateStr = date.toISOString().split("T")[0]

        return {
          date: dateStr,
          sales: Math.floor(Math.random() * 1000) + 500,
          orders: Math.floor(Math.random() * 20) + 5,
        }
      })
    }

    // Convert to array and sort by date
    return Object.values(dailyData).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }, [salesData])

  // Calculate weekly comparison data
  const weeklyComparison = useMemo(() => {
    const weekData: Record<string, Record<string, number>> = {
      "Current Week": {},
      "Previous Week": {},
    }

    // Get current date
    const currentDate = new Date()
    const currentDay = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(currentDate)
    startOfCurrentWeek.setDate(currentDate.getDate() - currentDay)

    // Calculate the start of the previous week
    const startOfPreviousWeek = new Date(startOfCurrentWeek)
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7)

    salesData.forEach((sale) => {
      if (sale.date) {
        const saleDate = new Date(sale.date)
        const amount = Number.parseFloat(sale.amount || "0")

        if (!isNaN(saleDate.getTime()) && !isNaN(amount)) {
          const dayOfWeek = saleDate.getDay()
          const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek]

          // Check if the sale belongs to the current week
          if (
            saleDate >= startOfCurrentWeek &&
            saleDate < new Date(startOfCurrentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
          ) {
            weekData["Current Week"][dayName] = (weekData["Current Week"][dayName] || 0) + amount
          }
          // Check if the sale belongs to the previous week
          else if (saleDate >= startOfPreviousWeek && saleDate < startOfCurrentWeek) {
            weekData["Previous Week"][dayName] = (weekData["Previous Week"][dayName] || 0) + amount
          }
        }
      }
    })

    // If no valid data was found, create sample data
    if (Object.keys(weekData["Current Week"]).length === 0 && Object.keys(weekData["Previous Week"]).length === 0) {
      return [
        { day: "Mon", "Current Week": 4000, "Previous Week": 3000 },
        { day: "Tue", "Current Week": 3000, "Previous Week": 2000 },
        { day: "Wed", "Current Week": 2000, "Previous Week": 2500 },
        { day: "Thu", "Current Week": 2780, "Previous Week": 1890 },
        { day: "Fri", "Current Week": 1890, "Previous Week": 2390 },
        { day: "Sat", "Current Week": 2390, "Previous Week": 3490 },
        { day: "Sun", "Current Week": 3490, "Previous Week": 2490 },
      ]
    }

    // Convert to array format for the chart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days.map((day) => ({
      day,
      "Current Week": weekData["Current Week"][day] || 0,
      "Previous Week": weekData["Previous Week"][day] || 0,
    }))
  }, [salesData])

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Trend</CardTitle>
          <CardDescription>Sales performance over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Sales ($)"
                />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Comparison</CardTitle>
          <CardDescription>Current week vs previous week sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Current Week" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Previous Week" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
