// Lightweight document database: each collection is one private JSON document.
// Production: Vercel Blob, with ETag (ifMatch) optimistic concurrency so two
// simultaneous edits never overwrite each other. Local dev: .data/<name>.json.
import { promises as fs } from 'fs'
import path from 'path'
import { BlobPreconditionFailedError, get, put } from '@vercel/blob'

type Doc<T> = { items: T[]; etag: string | null }

// The Blob store is shared by every environment, so only deployments use it by default;
// local dev keeps its own files unless USE_BLOB_LOCALLY=1 is set.
const useBlob = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) &&
  Boolean(process.env.VERCEL || process.env.USE_BLOB_LOCALLY)
const blobPath = (name: string) => `db/${name}.json`
const localPath = (name: string) => path.join(process.cwd(), '.data', `${name}.json`)

async function load<T>(name: string): Promise<Doc<T> | null> {
  if (useBlob()) {
    const res = await get(blobPath(name), { access: 'private', useCache: false })
    if (!res || res.statusCode !== 200) return null
    return { items: JSON.parse(await new Response(res.stream).text()), etag: res.blob.etag }
  }
  try {
    return { items: JSON.parse(await fs.readFile(localPath(name), 'utf8')), etag: null }
  } catch {
    return null
  }
}

async function save<T>(name: string, items: T[], etag: string | null) {
  const body = JSON.stringify(items, null, 2)
  if (useBlob()) {
    await put(blobPath(name), body, {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'application/json',
      // Existing document: only write if nobody changed it since we read it.
      // New document: fail if someone else created it first.
      ...(etag ? { allowOverwrite: true, ifMatch: etag } : { allowOverwrite: false }),
    })
    return
  }
  await fs.mkdir(path.dirname(localPath(name)), { recursive: true })
  await fs.writeFile(localPath(name), body)
}

/** All documents in a collection. A missing collection starts from `seed`. */
export async function list<T>(name: string, seed: T[] = []): Promise<T[]> {
  return (await load<T>(name))?.items ?? seed
}

/**
 * Read-modify-write a collection. `fn` gets a copy of the items and returns the
 * new items plus any value to hand back. Retries if another write got there first.
 */
export async function mutate<T, R = void>(
  name: string,
  seed: T[],
  fn: (items: T[]) => { items: T[]; result?: R } | Promise<{ items: T[]; result?: R }>,
): Promise<R | undefined> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = await load<T>(name)
    const current = structuredClone(doc?.items ?? seed)
    const { items, result } = await fn(current)
    try {
      await save(name, items, doc?.etag ?? null)
      return result
    } catch (e) {
      const conflict = e instanceof BlobPreconditionFailedError || /already exists|precondition/i.test(String(e))
      if (!conflict || attempt === 4) throw e
      await new Promise((r) => setTimeout(r, 50 * 2 ** attempt))
    }
  }
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
