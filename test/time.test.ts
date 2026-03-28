import { afterEach, describe, expect, it, vi } from 'vitest'
import { EPOCH_2026_MS, EPOCH_2026_MS_N, MAX_HUID_N, MAX_TIME_MS } from '../src/constants'
import { HUIDError } from '../src/error'
import { _huidTimeComponent, huidDecodeTime } from '../src/time'

const expectHUIDError = (fn: () => unknown, code: HUIDError['name']) => {
    try {
        fn()
        throw new Error('Expected function to throw HUIDError')
    } catch (err) {
        expect(err).toBeInstanceOf(HUIDError)
        expect((err as HUIDError).name).toBe(code)
    }
}

describe('_huidTimeComponent', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('returns milliseconds since 2026 epoch', () => {
        vi.spyOn(Date, 'now').mockReturnValue(EPOCH_2026_MS + 42)
        expect(_huidTimeComponent()).toBe(42n)
    })

    it('throws TIME_UNDERFLOW before 2026 epoch', () => {
        vi.spyOn(Date, 'now').mockReturnValue(EPOCH_2026_MS - 1)
        expectHUIDError(() => _huidTimeComponent(), 'TIME_UNDERFLOW')
    })

    it('throws TIME_OVERFLOW after max representable time', () => {
        vi.spyOn(Date, 'now').mockReturnValue(EPOCH_2026_MS + MAX_TIME_MS + 1)
        expectHUIDError(() => _huidTimeComponent(), 'TIME_OVERFLOW')
    })

    it('accepts upper boundary time exactly', () => {
        vi.spyOn(Date, 'now').mockReturnValue(EPOCH_2026_MS + MAX_TIME_MS)
        expect(_huidTimeComponent()).toBe(BigInt(MAX_TIME_MS))
    })
})

describe('huidDecodeTime', () => {
    it('throws TYPE_ERROR for non-bigint input', () => {
        expectHUIDError(() => huidDecodeTime(123 as unknown as bigint), 'TYPE_ERROR')
    })

    it('throws INVALID_HUID for out-of-range ids', () => {
        expectHUIDError(() => huidDecodeTime(-1n), 'INVALID_HUID')
        expectHUIDError(() => huidDecodeTime(MAX_HUID_N + 1n), 'INVALID_HUID')
    })

    it('decodes the time component from a valid id', () => {
        const timePart = 987654n
        const randPart = 123n
        const id = (timePart << 21n) | randPart
        const decoded = huidDecodeTime(id)

        expect(BigInt(decoded.getTime())).toBe(EPOCH_2026_MS_N + timePart)
    })
})
