import { useSyncExternalStore } from 'react'
import type { DocsSession } from '@/lib/docsApi'

const STORAGE_KEY = 'docs.session'

function read(): DocsSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as DocsSession
    if (!s?.token) return null
    if (typeof s.exp === 'number' && s.exp * 1000 <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return s
  } catch {
    return null
  }
}

function write(session: DocsSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
  emit()
}

let cached: DocsSession | null = read()
const listeners = new Set<() => void>()

function emit() {
  cached = read()
  for (const fn of listeners) fn()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): DocsSession | null {
  return cached
}

export function getSession(): DocsSession | null {
  return getSnapshot()
}

export function setSession(session: DocsSession | null) {
  write(session)
}

export function clearSession() {
  write(null)
}

export function useDocsSession(): DocsSession | null {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function isSuperAdmin(session: DocsSession | null): boolean {
  return session?.role === 'superAdmin'
}
