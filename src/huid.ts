import { MAX_HUID_N } from './constants'
import { HUIDError } from './error'
import { _huidRandComponent } from './random'
import { _huidTimeComponent } from './time'

/**
 * Generates an unique time sortable identifier (HUID). The ID is an encoded
 * 63-bits bigint that consists of the time of generation (ms precision) and a
 * random component.
 *
 * HUID's are valid until the year 2165, and can generate up to ~2 million
 * unique IDs per ms. The time component is 42 bits, and the random component
 * is 21 bits totalling 63 bits (8 bytes) when encoded as a bigint. The most
 * significant bit is always 0 to ensure the ID is non-negative when treated as
 * a signed bigint.
 *
 * When encoded as a Buffer it should be exactly 8 bytes long in big-endian
 * format.
 *
 * Throws HUIDError('TIME_OVERFLOW') if the current time exceeds the maximum
 * representable time.
 *
 * @returns A new HUID as a bigint.
 */
export function huid(): bigint {
    // time component bigint
    const timeN = _huidTimeComponent() // 42-bits

    // random component bigint
    const randN = _huidRandComponent() // 21-bits

    // Combine time and random parts into a single 63-bit bigint
    const id = (timeN << 21n) | randN

    // return the ID as a bigint
    return id
}

/**
 * Returns the successor of a given HUID. The successor is the next possible
 * HUID that can be generated after the given HUID. The successor is calculated
 * by simply adding 1 to the given ID which effectively increments the random
 * component while keeping the time component the same until it overflows, at
 * which point the time component will increment and the random component will
 * reset to 0.
 *
 * Throws HUIDError('HUID_OVERFLOW') if the given ID is greater than or equal
 * to the maximum possible HUID (2^63 - 1).
 */
export function huidSucc(id: bigint): bigint {
    const next = id + 1n

    if (next > MAX_HUID_N) {
        throw new HUIDError('HUID_OVERFLOW')
    }

    return next
}

/**
 * This function returns the predecessor of a given HUID. The predecessor is
 * the previous possible HUID that could have been generated before the given
 * HUID.
 *
 * The predecessor is calculated by simply subtracting 1 from the given HUID,
 * which effectively decrements the random component while keeping the time
 * component the same until it underflows, at which point the time component
 * will decrement and the random component will reset to its maximum value.
 *
 * Throws HUIDError('HUID_UNDERFLOW') if the given ID is 0.
 */
export function huidPred(id: bigint): bigint {
    if (id === 0n) {
        throw new HUIDError('HUID_UNDERFLOW')
    }

    return id - 1n
}
