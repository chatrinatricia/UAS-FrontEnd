export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Memuat...</span>
      </div>
    </div>
  );
}
