// Halaman 404 kustom.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-3 fw-bold">404</h1>
      <p className="lead">Halaman atau data yang dicari tidak ditemukan.</p>
      <Link href="/" className="btn btn-primary">Kembali ke Beranda</Link>
    </div>
  );
}
