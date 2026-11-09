export type MemoryStatus = "pending" | "approved" | "rejected";

export type Memory = {
  id: string;
  nama: string;
  rating: number;
  cerita: string;
  status: string;
  tanggal: string;
};

export const memoryFields = {
  id: true, nama: true, rating: true, cerita: true, status: true, tanggal: true,
} as const;
