"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileIcon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function FileUploader() {
  const router = useRouter()
  const [finalFile, setFinalFile] = useState<File | null>(null)
  const [salesFile, setSalesFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFinalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFinalFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSalesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSalesFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!finalFile || !salesFile) {
      setError("Please upload both required files")
      return
    }

    setIsLoading(true)

    // try {
    //   // Create a FormData object to send the files
    //   const formData = new FormData()
    //   formData.append("final_data", finalFile)
    //   formData.append("sales_data", salesFile)

    //   // Send the files to the API endpoint
    //   const response = await fetch("http://127.0.0.1:8000/upload/", {
    //     method: "POST",
    //     body: formData,
    //   })

    //   if (!response.ok) {
    //     const errorData = await response.json()
    //     throw new Error(errorData.error || "Failed to process files")
    //   }

    //   // const data = await response.json()

    //   // Store the recommendations in localStorage
    //   console.log(response.body);
    //   localStorage.setItem("inventoryRecommendations", JSON.stringify(response.body))

    //   // Navigate to the dashboard
    //   router.push("/dashboard")
    // } catch (error) {
    //   console.error("Error processing files:", error)
    //   setError(error instanceof Error ? error.message : "Error processing files. Please try again.")
    // } 
    try {
      // Create a FormData object to send the files
      const formData = new FormData()
      formData.append("final_data", finalFile)
      formData.append("sales_data", salesFile)
    
      // Send the files to the API endpoint
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      })
    
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process files")
      }
    
      // ✅ Parse the JSON response correctly
      const data = await response.json()
    
      // Store the recommendations in localStorage
      localStorage.setItem("inventoryRecommendations", JSON.stringify(data))
    
      // Navigate to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error processing files:", error)
      setError(error instanceof Error ? error.message : "Error processing files. Please try again.")
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Inventory Data</CardTitle>
          <CardDescription>
            Upload your test_final_dataset and test_sales_data files to generate inventory analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="final-file">Test Final Dataset</Label>
            <div className="flex items-center gap-2">
              <Input id="final-file" type="file" accept=".csv" onChange={handleFinalFileChange} className="flex-1" />
              {finalFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-4 w-4" />
                  <span>{finalFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload the test_final_dataset.csv file containing inventory information
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sales-file">Test Sales Data</Label>
            <div className="flex items-center gap-2">
              <Input id="sales-file" type="file" accept=".csv" onChange={handleSalesFileChange} className="flex-1" />
              {salesFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-4 w-4" />
                  <span>{salesFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload the test_sales_data.csv file containing sales history
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!finalFile || !salesFile || isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                Processing... <span className="animate-spin">⏳</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UploadIcon className="h-4 w-4" /> Generate Analysis
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
