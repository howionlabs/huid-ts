import { EPOCH_2026_MS_N, MAX_HUID_N, MAX_TIME_MS_N } from './constants'
import { HUIDError } from './error'

/**
 * Returns the current time in milliseconds since the 2026 epoch as a bigint.
 * Throws if the current time is before the 2026 epoch or beyond the maximum
 * representable time.
 */
export function _huidTimeComponent(): bigint {
    const unixMS = BigInt(Date.now())
    const timeN = unixMS - EPOCH_2026_MS_N

    if (timeN < 0n) {
        throw new HUIDError('TIME_UNDERFLOW')
    }

    if (timeN > MAX_TIME_MS_N) {
        throw new HUIDError('TIME_OVERFLOW')
    }

    return unixMS - EPOCH_2026_MS_N
}

export function huidDecodeTime(id: bigint): Date {
    if (typeof id !== 'bigint') {
        throw new HUIDError('TYPE_ERROR')
    }

    if (id < 0n || id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    const timeN = id >> 21n
    const unixMS = timeN + EPOCH_2026_MS_N

    return new Date(Number(unixMS))
}
