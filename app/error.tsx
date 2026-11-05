"use client";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="text-center py-5">
      <h1 className="h2 fw-bold">Terjadi kesalahan</h1>
      <p className="text-body-secondary">{error.message || "Coba muat ulang halaman."}</p>
      <button type="button" className="btn btn-primary" onClick={() => reset()}>Coba Lagi</button>
    </div>
  );
}
