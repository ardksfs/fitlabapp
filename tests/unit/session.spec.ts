import { beforeEach, describe, expect, test } from 'vitest'
import {
  SESSION_KEY,
  getDashboardPath,
  getSessionRole,
  normalizeRole,
  readSession,
} from '@/utils/session'

describe('session helpers', () => {
  beforeEach(() => localStorage.clear())

  test('normalizeRole maps aliases to canonical roles', () => {
    expect(normalizeRole('Member')).toBe('user')
    expect(normalizeRole('gym-member')).toBe('user')
    expect(normalizeRole(' Personal Trainer ')).toBe('pt')
    expect(normalizeRole('ADMINISTRATOR')).toBe('admin')
    expect(normalizeRole(undefined)).toBe('')
  })

  test('getDashboardPath falls back to /login for unknown roles', () => {
    expect(getDashboardPath('admin')).toBe('/admin/dashboard')
    expect(getDashboardPath('pt')).toBe('/pt/dashboard')
    expect(getDashboardPath('user')).toBe('/user/dashboard')
    expect(getDashboardPath('hacker')).toBe('/login')
  })

  test('readSession returns a valid object session', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: 'a@b.co', role: 'member' }))
    expect(readSession()).toEqual({ email: 'a@b.co', role: 'member' })
    expect(getSessionRole(readSession())).toBe('user')
  })

  test.each(['{not json', 'null', '123', '[]', '"admin"'])(
    'readSession discards corrupt value %s',
    (value) => {
      localStorage.setItem(SESSION_KEY, value)
      expect(readSession()).toBeNull()
      expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    },
  )
})
