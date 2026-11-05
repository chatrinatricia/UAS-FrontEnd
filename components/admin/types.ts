import type { Dispatch, SetStateAction } from "react";

export type Notify = (text: string, type?: "success" | "danger") => void;
export type SetList<T> = Dispatch<SetStateAction<T[]>>;
