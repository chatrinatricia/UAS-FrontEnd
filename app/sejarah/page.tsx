// app/sejarah/page.tsx
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function SejarahKerakTelorPage() {
  // Mengambil data sejarah dari database
  const sejarahData = await prisma.sejarah.findFirst()

  return (
    <main className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">
          {sejarahData?.judul || "Sejarah Kerak Telor"}
        </h1>
        
        <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {sejarahData?.konten || "Memuat sejarah kerak telor..."}
        </div>
      </div>
    </main>
  )
}