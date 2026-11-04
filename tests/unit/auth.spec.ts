import { describe, expect, test } from 'vitest'
import {
  canHashPasswords,
  createSalt,
  hashPassword,
  isValidEmail,
  timingSafeEqual,
} from '@/utils/auth'

describe('auth helpers', () => {
  test('isValidEmail', () => {
    expect(isValidEmail('member@fitlab.com')).toBe(true)
    expect(isValidEmail('no-at-sign')).toBe(false)
    expect(isValidEmail('a b@c.de')).toBe(false)
    expect(isValidEmail(`${'a'.repeat(250)}@x.io`)).toBe(false)
  })

  test('timingSafeEqual', () => {
    expect(timingSafeEqual('abc', 'abc')).toBe(true)
    expect(timingSafeEqual('abc', 'abd')).toBe(false)
    expect(timingSafeEqual('abc', 'abcd')).toBe(false)
  })

  test('password hashing is salted and repeatable', async () => {
    expect(canHashPasswords()).toBe(true)

    const salt = createSalt()
    expect(salt).toMatch(/^[0-9a-f]{32}$/)

    const first = await hashPassword('secret-123', salt)
    expect(first).toMatch(/^[0-9a-f]{64}$/)
    expect(first).not.toContain('secret')
    expect(await hashPassword('secret-123', salt)).toBe(first)
    expect(await hashPassword('secret-124', salt)).not.toBe(first)
    expect(await hashPassword('secret-123', createSalt())).not.toBe(first)
  })
})
