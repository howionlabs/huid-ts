import { describe, expect, it, vi } from 'vitest'
import { EPOCH_2026_MS } from '../src/constants'
import { HUIDError } from '../src/error'
import { huidValidator } from '../src/validation'

const makeId = (unixMs: number, random = 0n): bigint => (BigInt(unixMs - EPOCH_2026_MS) << 21n) | random
const expectHUIDError = (fn: () => unknown, code: HUIDError['name']) => {
    try {
        fn()
        throw new Error('Expected function to throw HUIDError')
    } catch (err) {
        expect(err).toBeInstanceOf(HUIDError)
        expect((err as HUIDError).name).toBe(code)
    }
}

describe('huidValidator', () => {
    it('accepts valid ids by default', () => {
        const validate = huidValidator()
        expect(validate(makeId(EPOCH_2026_MS + 10))).toBe(true)
    })

    it('returns false for non-bigint and out-of-range ids', () => {
        const validate = huidValidator()
        expect(validate(123 as unknown as bigint)).toBe(false)
        expect(validate(-1n)).toBe(false)
        expect(validate((1n << 63n) + 1n)).toBe(false)
    })

    it('disallows future ids when disallowFuture=true', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'))

        const nowMs = Date.now()
        const validate = huidValidator({ disallowFuture: true })

        expect(validate(makeId(nowMs - 1))).toBe(true)
        expect(validate(makeId(nowMs))).toBe(true)
        expect(validate(makeId(nowMs + 1))).toBe(false)

        vi.useRealTimers()
    })

    it('disallowBefore enforces lower bound inclusively with Date', () => {
        const lower = new Date('2031-06-01T00:00:00.000Z')
        const validate = huidValidator({ disallowBefore: lower })

        expect(validate(makeId(lower.getTime() - 1))).toBe(false)
        expect(validate(makeId(lower.getTime()))).toBe(true)
        expect(validate(makeId(lower.getTime() + 1))).toBe(true)
    })

    it('disallowAfter alone does not constrain validation', () => {
        const upper = new Date('2031-06-01T00:00:00.000Z')
        const validate = huidValidator({ disallowAfter: upper })

        expect(validate(makeId(upper.getTime() - 1))).toBe(true)
        expect(validate(makeId(upper.getTime()))).toBe(true)
        expect(validate(makeId(upper.getTime() + 1))).toBe(true)
    })

    it('uses bigint disallowBefore boundary and accepts disallowAfter bigint option', () => {
        const lowerId = makeId(Date.parse('2032-01-01T00:00:00.000Z'))
        const upperId = makeId(Date.parse('2032-01-02T00:00:00.000Z'))
        const validate = huidValidator({
            disallowBefore: lowerId,
            disallowAfter: upperId
        })

        expect(validate(makeId(Date.parse('2031-12-31T23:59:59.999Z')))).toBe(false)
        expect(validate(lowerId)).toBe(true)
        expect(validate(makeId(Date.parse('2032-01-01T12:00:00.000Z')))).toBe(true)
        expect(validate(upperId)).toBe(true)
        expect(validate(makeId(Date.parse('2032-01-02T00:00:00.001Z')))).toBe(true)
    })

    it('uses the stricter upper bound when both disallowFuture and disallowAfter are set', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2035-01-01T00:00:00.000Z'))

        const stricter = new Date('2034-01-01T00:00:00.000Z')
        const validate = huidValidator({
            disallowFuture: true,
            disallowAfter: stricter
        })

        expect(validate(makeId(Date.parse('2034-06-01T00:00:00.000Z')))).toBe(false)
        expect(validate(makeId(Date.parse('2033-12-31T23:59:59.999Z')))).toBe(true)

        vi.useRealTimers()
    })

    it('throws TYPE_ERROR during validator creation for invalid option types', () => {
        expectHUIDError(() => huidValidator({ disallowBefore: 'invalid' as unknown as Date }), 'TYPE_ERROR')
        expect(() => huidValidator({ disallowAfter: 'invalid' as unknown as Date })).not.toThrow()
    })
})
