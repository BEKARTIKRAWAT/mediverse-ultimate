import { openDB } from "idb";

const DB_NAME = "mediverse_v2";
const STORES = ["medications", "appointments", "health", "chat", "streaks"];

export async function initDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      STORES.forEach(store => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" });
      });
    },
  });
}

export async function syncAllToIndexedDB(userId: string) {
  const db = await initDB();
  const prefixes = ["mediverse_meds", "mediverse_appointments", "mediverse_health", "mediverse_chat", "mediverse_streaks"];
  for (const prefix of prefixes) {
    const local = JSON.parse(localStorage.getItem(`${prefix}_${userId}`) || "[]");
    const tx = db.transaction(prefix.replace("mediverse_", ""), "readwrite");
    for (const item of local) await tx.store.put({ ...item, _userId: userId });
    await tx.done;
  }
  console.log("🔄 Synced to IndexedDB (offline ready)");
}
