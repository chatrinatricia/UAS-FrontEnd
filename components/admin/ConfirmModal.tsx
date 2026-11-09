"use client";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type ConfirmModalProps = {
  show: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  show,
  message = "Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title as="h5">Konfirmasi Hapus</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button variant="danger" onClick={onConfirm}>Ya, Hapus!</Button>
      </Modal.Footer>
    </Modal>
  );
}
