/**
 * Unix epoch time in milliseconds for 2026-01-01T00:00:00.000Z.
 */
export const EPOCH_2026_MS = 1767225600000
export const EPOCH_2026_MS_N = 1767225600000n

/**
 * Maximum milliseconds since 2026 epoch that can be represented in 42 bits.
 * Roughly 139 years since 2026 which corresponds to 2165 May 15.
 */
export const MAX_TIME_MS = 2 ** 42 - 1
export const MAX_TIME_MS_N = BigInt(MAX_TIME_MS)

export const MASK_21_BITS = 0x1fffff
export const MASK_21_BITS_N = BigInt(0x1fffff)

/**
 * The maximum HUID value 2**63 - 1 in bigint (for signed 63 bits).
 */
export const MAX_HUID_N = (1n << 63n) - 1n
