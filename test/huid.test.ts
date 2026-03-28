import { afterEach, describe, expect, it, vi } from 'vitest'
import { EPOCH_2026_MS, MAX_HUID_N } from '../src/constants'
import { HUIDError } from '../src/error'
import { huid, huidPred, huidSucc } from '../src/huid'
import { huidDecodeRandom } from '../src/random'
import { huidDecodeTime } from '../src/time'

const expectHUIDError = (fn: () => unknown, code: HUIDError['name']) => {
    try {
        fn()
        throw new Error('Expected function to throw HUIDError')
    } catch (err) {
        expect(err).toBeInstanceOf(HUIDError)
        expect((err as HUIDError).name).toBe(code)
    }
}

describe('huid', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('creates a bigint id with expected time and random components', () => {
        vi.spyOn(Date, 'now').mockReturnValue(EPOCH_2026_MS + 10)

        const id = huid()

        expect(typeof id).toBe('bigint')
        expect(BigInt(huidDecodeTime(id).getTime())).toBe(BigInt(EPOCH_2026_MS + 10))
        expect(huidDecodeRandom(id)).toBeGreaterThanOrEqual(0n)
        expect(huidDecodeRandom(id)).toBeLessThanOrEqual(0x1fffffn)
    })
})

describe('huidSucc', () => {
    it('returns next id for valid input', () => {
        expect(huidSucc(0n)).toBe(1n)
        expect(huidSucc(41n)).toBe(42n)
    })

    it('throws HUID_OVERFLOW at max id', () => {
        expectHUIDError(() => huidSucc(MAX_HUID_N), 'HUID_OVERFLOW')
    })
})

describe('huidPred', () => {
    it('returns previous id for valid input', () => {
        expect(huidPred(1n)).toBe(0n)
        expect(huidPred(42n)).toBe(41n)
    })

    it('throws HUID_UNDERFLOW at zero', () => {
        expectHUIDError(() => huidPred(0n), 'HUID_UNDERFLOW')
    })
})
