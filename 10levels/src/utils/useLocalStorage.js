import { useEffect, useState } from 'react'

// Persists a piece of state to localStorage so progress survives a reload or
// the tab being closed. Falls back to `initialValue` in private/blocked
// storage contexts instead of throwing.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // private mode / storage full / disabled — progress just won't persist
    }
  }, [key, value])

  return [value, setValue]
}
