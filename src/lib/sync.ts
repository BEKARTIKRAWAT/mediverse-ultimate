import { openDB } from "idb";

const DB_NAME = "mediverse_db";
const STORES = ["medications", "appointments", "health", "chat"];

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      STORES.forEach(store => { if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" }); });
    },
  });
}

export async function saveToDB(store: string, data: any[]) {
  const db = await initDB();
  const tx = db.transaction(store, "readwrite");
  await Promise.all(data.map(item => tx.store.put(item)));
  await tx.done;
}

export async function loadFromDB(store: string) {
  const db = await initDB();
  return db.getAll(store);
}

export async function syncAll(userId: string) {
  const stores = ["mediverse_meds", "mediverse_appointments", "mediverse_health", "mediverse_chat"];
  for (const store of stores) {
    const key = `${store}_${userId}`;
    const localData = JSON.parse(localStorage.getItem(key) || "[]");
    await saveToDB(store.replace("mediverse_", ""), localData);
  }
  console.log("Synced to IndexedDB");
}
