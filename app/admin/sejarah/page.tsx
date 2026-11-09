// app/admin/sejarah/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function AdminSejarahPage() {
  const [judul, setJudul] = useState('')
  const [konten, setKonten] = useState('')
  const [loading, setLoading] = useState(true)
  const [pesan, setPesan] = useState('')

  // Ambil data sejarah yang ada saat halaman dimuat
  useEffect(() => {
    fetch('/api/admin/sejarah')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setJudul(data.judul || '')
          setKonten(data.konten || '')
        }
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPesan('Menyimpan...')

    const res = await fetch('/api/admin/sejarah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, konten }),
    })

    if (res.ok) {
      setPesan('Sejarah berhasil diperbarui!')
    } else {
      setPesan('Gagal menyimpan perubahan.')
    }
  }

  if (loading) return <p className="p-6">Memuat data editor...</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Editor Sejarah Kerak Telor</h1>
      {pesan && <p className="mb-4 text-sm font-semibold text-amber-600">{pesan}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border rounded-md p-2 focus:ring focus:ring-amber-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konten Sejarah</label>
          <textarea
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            rows={10}
            className="w-full border rounded-md p-2 focus:ring focus:ring-amber-300"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}