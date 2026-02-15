const DB_NAME = "logicLooperDB";
const STORE = "progress";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProgress(data) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put({ id: "daily", ...data });
}

export async function getProgress() {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const req = store.get("daily");

  return new Promise(resolve => {
    req.onsuccess = () => resolve(req.result);
  });
}
