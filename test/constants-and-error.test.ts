import { describe, expect, it } from 'vitest'
import {
    EPOCH_2026_MS,
    EPOCH_2026_MS_N,
    MASK_21_BITS,
    MASK_21_BITS_N,
    MAX_TIME_MS,
    MAX_TIME_MS_N
} from '../src/constants'
import { HUIDError } from '../src/error'

describe('constants', () => {
    // it('exports expected fixed values', () => {
    //     expect(EPOCH_2026_MS).toBe(1767225600000)
    //     expect(MAX_TIME_MS).toBe(2 ** 42 - 1)
    //     expect(MASK_21_BITS).toBe(0x1fffff)
    //     expect(MAX_HUID_N).toBe((1n << 63n) - 1n)
    // })

    it('keeps bigint and number constants consistent', () => {
        expect(EPOCH_2026_MS_N).toBe(BigInt(EPOCH_2026_MS))
        expect(MAX_TIME_MS_N).toBe(BigInt(MAX_TIME_MS))
        expect(MASK_21_BITS_N).toBe(BigInt(MASK_21_BITS))
    })
})

describe('HUIDError', () => {
    it('uses code as name and cause', () => {
        const err = new HUIDError('TIME_OVERFLOW')

        expect(err).toBeInstanceOf(Error)
        expect(err).toBeInstanceOf(HUIDError)
        expect(err.name).toBe('TIME_OVERFLOW')
        expect(err.cause).toBe('TIME_OVERFLOW')
    })
})
