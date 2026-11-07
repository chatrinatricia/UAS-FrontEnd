export type MemoryStatus = "pending" | "approved" | "rejected";

export type Memory = {
  id: string;
  nama: string;
  rating: number;
  cerita: string;
  status: MemoryStatus;
  tanggal: string;
};

const STORAGE_KEY = "kerak_telor_memories";
const EVENT_NAME = "memories-updated";

export function bacaMemories(): Memory[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);
    return Array.isArray(parsed) ? (parsed as Memory[]) : [];
  } catch {
    return [];
  }
}

export function simpanMemories(data: Memory[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function dengarkanMemories(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

export function buatMemory(
  nama: string,
  rating: number,
  cerita: string
): Memory {
  return {
    id: crypto.randomUUID(),
    nama: nama.trim() || "Anonim",
    rating,
    cerita: cerita.trim(),
    status: "pending",
    tanggal: new Date().toISOString(),
  };
}
