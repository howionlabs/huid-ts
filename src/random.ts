import { randomBytes } from 'node:crypto'
import { MASK_21_BITS, MASK_21_BITS_N, MAX_HUID_N } from './constants'
import { HUIDError } from './error'

/**
 * Returns a 21-bit cryptographically secure random number as a bigint.
 */
export function _huidRandComponent(): bigint {
    const bytes = randomBytes(3)
    const rand = bytes.readUIntBE(0, 3) // reads 24 bits
    return BigInt(rand & MASK_21_BITS)
}

export function huidDecodeRandom(id: bigint): bigint {
    if (typeof id !== 'bigint') {
        throw new HUIDError('TYPE_ERROR')
    }

    if (id < 0n || id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    return id & MASK_21_BITS_N
}
