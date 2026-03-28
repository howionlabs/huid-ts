import { describe, expect, it } from 'vitest'
import { MAX_HUID_N } from '../src/constants'
import { huidFromBuffer, huidFromByteArray, huidToBuffer, huidToByteArray } from '../src/conversion'
import { HUIDError } from '../src/error'

const expectHUIDError = (fn: () => unknown, code: HUIDError['name']) => {
    try {
        fn()
        throw new Error('Expected function to throw HUIDError')
    } catch (err) {
        expect(err).toBeInstanceOf(HUIDError)
        expect((err as HUIDError).name).toBe(code)
    }
}

describe('buffer conversions', () => {
    it('converts id to 8-byte big-endian buffer', () => {
        const id = 0x0102030405060708n
        const buf = huidToBuffer(id)

        expect(buf).toEqual(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]))
    })

    it('converts 8-byte big-endian buffer to id', () => {
        const id = huidFromBuffer(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]))
        expect(id).toBe(0x0102030405060708n)
    })

    it('round-trips id through buffer', () => {
        const ids = [0n, 1n, 123456789012345678n, MAX_HUID_N]

        for (const id of ids) {
            expect(huidFromBuffer(huidToBuffer(id))).toBe(id)
        }
    })

    it('rejects invalid id for toBuffer', () => {
        expectHUIDError(() => huidToBuffer(-1n), 'INVALID_HUID')
        expectHUIDError(() => huidToBuffer(MAX_HUID_N + 1n), 'INVALID_HUID')
    })

    it('rejects invalid buffer lengths and overflow values', () => {
        expectHUIDError(() => huidFromBuffer(Buffer.alloc(7)), 'INVALID_HUID')
        expectHUIDError(() => huidFromBuffer(Buffer.alloc(9)), 'INVALID_HUID')
        expectHUIDError(() => huidFromBuffer(Buffer.from([0x80, 0, 0, 0, 0, 0, 0, 0])), 'INVALID_HUID')
    })
})

describe('byte array conversions', () => {
    it('converts id to 8-byte big-endian Uint8Array', () => {
        const id = 0x0102030405060708n
        const arr = huidToByteArray(id)

        expect([...arr]).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    })

    it('converts 8-byte big-endian Uint8Array to id', () => {
        const id = huidFromByteArray(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
        expect(id).toBe(0x0102030405060708n)
    })

    it('round-trips id through byte array', () => {
        const ids = [0n, 1n, 123456789012345678n, MAX_HUID_N]

        for (const id of ids) {
            expect(huidFromByteArray(huidToByteArray(id))).toBe(id)
        }
    })

    it('rejects invalid id for toByteArray', () => {
        expectHUIDError(() => huidToByteArray(-1n), 'INVALID_HUID')
        expectHUIDError(() => huidToByteArray(MAX_HUID_N + 1n), 'INVALID_HUID')
    })

    it('rejects invalid array lengths and overflow values', () => {
        expectHUIDError(() => huidFromByteArray(new Uint8Array(7)), 'INVALID_HUID')
        expectHUIDError(() => huidFromByteArray(new Uint8Array(9)), 'INVALID_HUID')
        expectHUIDError(() => huidFromByteArray(new Uint8Array([0x80, 0, 0, 0, 0, 0, 0, 0])), 'INVALID_HUID')
    })
})
