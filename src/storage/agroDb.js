export const DATABASE_NAME = 'agro-pwa'
export const DATABASE_VERSION = 1

export const STORE_NAMES = {
  crops: 'cultivos',
  activities: 'avances',
  photos: 'fotografias',
  syncQueue: 'colaSincronizacion',
}

const storeDefinitions = {
  [STORE_NAMES.crops]: ['updatedAt', 'syncStatus'],
  [STORE_NAMES.activities]: ['cultivoId', 'updatedAt', 'syncStatus'],
  [STORE_NAMES.photos]: ['avanceId', 'updatedAt', 'syncStatus'],
  [STORE_NAMES.syncQueue]: ['status', 'entityType', 'createdAt'],
}

function assertStoreName(storeName) {
  if (!Object.values(STORE_NAMES).includes(storeName)) {
    throw new Error(`Almacén de IndexedDB no válido: ${storeName}`)
  }
}

function createStore(database, storeName, indexes) {
  const store = database.createObjectStore(storeName, { keyPath: 'id' })
  indexes.forEach((indexName) => store.createIndex(indexName, indexName))
}

export function openAgroDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      Object.entries(storeDefinitions).forEach(([storeName, indexes]) => {
        if (!database.objectStoreNames.contains(storeName)) {
          createStore(database, storeName, indexes)
        }
      })
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function createRecord(record) {
  const timestamp = new Date().toISOString()

  return {
    ...record,
    id: record.id ?? crypto.randomUUID(),
    createdAt: record.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

export async function saveRecord(storeName, record) {
  assertStoreName(storeName)
  const database = await openAgroDatabase()
  const value = createRecord(record)

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    const request = transaction.objectStore(storeName).put(value)

    request.onsuccess = () => resolve(value)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => database.close()
  })
}

export async function getRecord(storeName, id) {
  assertStoreName(storeName)
  const database = await openAgroDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const request = transaction.objectStore(storeName).get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => database.close()
  })
}

export async function deleteRecord(storeName, id) {
  assertStoreName(storeName)
  const database = await openAgroDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    const request = transaction.objectStore(storeName).delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => database.close()
  })
}
