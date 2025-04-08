import type { Metadata } from "next"
import Link from "next/link"
import { InventoryDashboard } from "@/components/inventory-dashboard"

export const metadata: Metadata = {
  title: "Inventory Analysis Dashboard",
  description: "View inventory analysis, demand predictions, and recommendations",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Shopkeeper Inventory Analysis</span>
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Upload New Files
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <InventoryDashboard />
      </main>
    </div>
  )
}
