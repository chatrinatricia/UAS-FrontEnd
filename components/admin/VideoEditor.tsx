"use client";

import { useRef, useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import type { TutorialVideo } from "@/lib/tutorial-videos";
import ConfirmModal from "./ConfirmModal";
import type { Notify } from "./types";

export default function VideoEditor({ videos, notify }: { videos: TutorialVideo[]; notify: Notify }) {
  const [list, setList] = useState(videos);
  const [editing, setEditing] = useState<number | null>(null);
  const [removing, setRemoving] = useState<TutorialVideo | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);

  function reset() {
    setEditing(null);
    setTitle("");
    setUrl("");
  }

  function edit(video: TutorialVideo) {
    setEditing(video.slot);
    setTitle(video.title);
    setUrl(`https://www.youtube.com/watch?v=${video.youtubeId}`);
    titleInput.current?.focus();
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const rows = await api<TutorialVideo[]>("/api/admin/videos", editing === null ? "POST" : "PUT", {
        original: editing, title, url,
      });
      setList(rows);
      reset();
      notify("Video berhasil disimpan.");
    } catch (error) {
      notify(errorMessage(error), "danger");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!removing || busy) return;
    setBusy(true);
    try {
      const rows = await api<TutorialVideo[]>("/api/admin/videos", "DELETE", { original: removing.slot });
      setList(rows);
      if (editing === removing.slot) reset();
      notify("Video berhasil dihapus.");
    } catch (error) {
      notify(errorMessage(error), "danger");
    } finally {
      setRemoving(null);
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="fs-4 fw-bold mb-4">{editing === null ? "Tambah Video" : "Edit Video"}</h2>
        <form onSubmit={save}>
          <fieldset disabled={busy}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" htmlFor="tutorial-title">Judul Video</label>
                <input className="form-control" ref={titleInput} id="tutorial-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Cara memasak kerak telor" required maxLength={150} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" htmlFor="tutorial-url">Tautan YouTube</label>
                <input className="form-control" id="tutorial-url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
              </div>
            </div>
            <button className="btn btn-primary w-100 mt-4" type="submit">{busy ? "Memproses…" : editing === null ? "Simpan Video" : "Update Video"}</button>
            {editing !== null && <button className="btn btn-secondary w-100 mt-2" type="button" onClick={() => reset()}>Batal Edit</button>}
          </fieldset>
        </form>
      </div>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fs-5 fw-bold mb-3">Daftar Video ({list.length})</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark"><tr><th>No</th><th>Thumbnail</th><th>Judul Video</th><th>Aksi</th></tr></thead>
            <tbody>
              {list.map((video, index) => (
                <tr key={video.slot}>
                  <td>{index + 1}</td>
                  <td><img className="thumb" src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`} alt="" /></td>
                  <td className="cell-wrap"><strong>{video.title}</strong></td>
                  <td><div className="d-flex gap-2">
                    <button type="button" disabled={busy} className="btn btn-warning btn-sm" onClick={() => edit(video)}>Edit</button>
                    <button type="button" disabled={busy} className="btn btn-danger btn-sm" onClick={() => setRemoving(video)}>Hapus</button>
                  </div></td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={4} className="text-center text-muted">Belum ada video.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal show={removing !== null} message={`Hapus video “${removing?.title}” dari Cara Pembuatan?`} onConfirm={remove} onCancel={() => setRemoving(null)} />
    </>
  );
}
