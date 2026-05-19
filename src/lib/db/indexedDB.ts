import { openDB, DBSchema } from 'idb';

interface MediverseDB extends DBSchema {
  medications: { key: string; value: any };
  appointments: { key: string; value: any };
  healthMetrics: { key: string; value: any };
  chat: { key: string; value: any };
  streaks: { key: string; value: any };
}

let dbPromise: ReturnType<typeof openDB<MediverseDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MediverseDB>('mediverse_v3', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('medications')) db.createObjectStore('medications', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('appointments')) db.createObjectStore('appointments', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('healthMetrics')) db.createObjectStore('healthMetrics', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('chat')) db.createObjectStore('chat', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('streaks')) db.createObjectStore('streaks', { keyPath: 'userId' });
      },
    });
  }
  return dbPromise;
}

export async function syncAllFromLocalStorage(userId: string) {
  const db = await getDB();
  const stores = ['medications', 'appointments', 'healthMetrics', 'chat'];
  for (const store of stores) {
    const key = `mediverse_${store}_${userId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const tx = db.transaction(store as any, 'readwrite');
    for (const item of data) await tx.store.put(item);
    await tx.done;
  }
  console.log('✅ Synced to IndexedDB');
}
