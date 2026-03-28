import { describe, expect, it } from 'vitest'
import * as lib from '../src/index'

describe('public index exports', () => {
    it('exports key APIs', () => {
        expect(typeof lib.huid).toBe('function')
        expect(typeof lib.huidSucc).toBe('function')
        expect(typeof lib.huidPred).toBe('function')
        expect(typeof lib.huidDecodeTime).toBe('function')
        expect(typeof lib.huidDecodeRandom).toBe('function')
        expect(typeof lib.huidValidator).toBe('function')
        expect(typeof lib.huidToBuffer).toBe('function')
        expect(typeof lib.huidFromBuffer).toBe('function')
    })
})
