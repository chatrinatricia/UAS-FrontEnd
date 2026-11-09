// app/api/admin/sejarah/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Mengambil data sejarah
export async function GET() {
  try {
    const sejarah = await prisma.sejarah.findFirst()
    return NextResponse.json(sejarah || { judul: '', konten: '' })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  }
}

// POST: Memperbarui atau membuat data sejarah baru
export async function POST(request: Request) {
  try {
    const { judul, konten } = await request.json()

    // Cek apakah data sejarah sudah ada di database
    const existing = await prisma.sejarah.findFirst()

    let result
    if (existing) {
      // Update jika sudah ada
      result = await prisma.sejarah.update({
        where: { id: existing.id },
        data: { judul, konten },
      })
    } else {
      // Buat baru jika belum ada
      result = await prisma.sejarah.create({
        data: { judul, konten },
      })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}