import { describe, expect, test } from 'vitest'
import { resolveNavigation } from '@/router/guard'

type Meta = Record<string, unknown>

function target(path: string, meta: Meta = {}) {
  return { path, meta, matched: [{ meta }] }
}

const admin = target('/admin/dashboard', { requiresAuth: true, role: 'admin' })
const pt = target('/pt/dashboard', { requiresAuth: true, role: 'pt' })
const user = target('/user/dashboard', { requiresAuth: true, role: 'user' })
const event = target('/member-event', { requiresAuth: true, role: 'user' })

describe('resolveNavigation', () => {
  test('login page is always reachable', () => {
    expect(resolveNavigation(target('/login'), null)).toBe(true)
    expect(resolveNavigation(target('/login'), { role: 'admin' })).toBe(true)
  })

  test('anonymous visitors are sent to /login for protected routes, including the event page', () => {
    for (const route of [admin, pt, user, event]) {
      expect(resolveNavigation(route, null)).toBe('/login')
    }
  })

  test('each role can open its own area', () => {
    expect(resolveNavigation(admin, { role: 'admin' })).toBe(true)
    expect(resolveNavigation(pt, { role: 'pt' })).toBe(true)
    expect(resolveNavigation(user, { role: 'member' })).toBe(true)
    expect(resolveNavigation(event, { role: 'member' })).toBe(true)
  })

  test('a role is redirected to its own dashboard from another role area', () => {
    expect(resolveNavigation(admin, { role: 'member' })).toBe('/user/dashboard')
    expect(resolveNavigation(admin, { role: 'pt' })).toBe('/pt/dashboard')
    expect(resolveNavigation(user, { role: 'admin' })).toBe('/admin/dashboard')
    expect(resolveNavigation(event, { role: 'admin' })).toBe('/admin/dashboard')
  })

  test('sessions with an unknown role never reach protected routes', () => {
    expect(resolveNavigation(admin, { role: 'superuser' })).toBe('/login')
    expect(resolveNavigation(user, {})).toBe('/login')
  })
})
