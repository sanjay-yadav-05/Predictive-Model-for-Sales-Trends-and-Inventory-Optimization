import type { Metadata } from "next"
import Link from "next/link"
import { FileUploader } from "@/components/file-uploader"

export const metadata: Metadata = {
  title: "Shopkeeper Inventory Analysis",
  description: "Upload your inventory data and get demand predictions and recommendations",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Shopkeeper Inventory Analysis</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Inventory Analysis Dashboard
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Upload your inventory data files to get demand predictions and inventory recommendations
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-1">
              <FileUploader />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
