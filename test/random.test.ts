import { afterEach, describe, expect, it, vi } from 'vitest'
import { MASK_21_BITS_N, MAX_HUID_N } from '../src/constants'
import { HUIDError } from '../src/error'
import { _huidRandComponent, huidDecodeRandom } from '../src/random'

const expectHUIDError = (fn: () => unknown, code: HUIDError['name']) => {
    try {
        fn()
        throw new Error('Expected function to throw HUIDError')
    } catch (err) {
        expect(err).toBeInstanceOf(HUIDError)
        expect((err as HUIDError).name).toBe(code)
    }
}

describe('_huidRandComponent', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('returns a bigint within 21-bit range', () => {
        const rand = _huidRandComponent()
        expect(typeof rand).toBe('bigint')
        expect(rand).toBeGreaterThanOrEqual(0n)
        expect(rand).toBeLessThanOrEqual(MASK_21_BITS_N)
    })

    it('always returns values where only low 21 bits are used', () => {
        for (let i = 0; i < 64; i++) {
            const rand = _huidRandComponent()
            expect(rand & ~MASK_21_BITS_N).toBe(0n)
        }
    })
})

describe('huidDecodeRandom', () => {
    it('throws TYPE_ERROR for non-bigint input', () => {
        expectHUIDError(() => huidDecodeRandom(1 as unknown as bigint), 'TYPE_ERROR')
    })

    it('throws INVALID_HUID for out-of-range ids', () => {
        expectHUIDError(() => huidDecodeRandom(-1n), 'INVALID_HUID')
        expectHUIDError(() => huidDecodeRandom(MAX_HUID_N + 1n), 'INVALID_HUID')
    })

    it('extracts low 21 bits', () => {
        const lowBits = 0x155aaan
        const id = (123456n << 21n) | lowBits
        expect(huidDecodeRandom(id)).toBe(lowBits)
    })
})
