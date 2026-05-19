import { atom } from "jotai";

export const userDataAtom = atom<any>(null);
export const syncStatusAtom = atom<"idle" | "syncing" | "success" | "error">("idle");
export const globalSearchAtom = atom("");
export const voiceCommandAtom = atom("");
