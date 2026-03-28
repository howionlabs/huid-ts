import { MAX_HUID_N } from './constants'
import { HUIDError } from './error'

/**
 * Converts a HUID bigint to an 8-byte Buffer in big-endian format. Throws if
 * the HUID is negative or exceeds the maximum value for 63 bits.
 *
 * Throws HUIDError('INVALID_HUID') if the input is invalid.
 */
export function huidToBuffer(id: bigint): Buffer {
    if (id < 0n) {
        throw new HUIDError('INVALID_HUID')
    } else if (id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    const buf = Buffer.alloc(8)
    buf.writeBigUInt64BE(id, 0)
    return buf
}

/**
 * Converts a HUID bigint to an uint8 array in big-endian format. Throws if
 * the HUID is negative or exceeds the maximum value for 63 bits.
 *
 * Throws HUIDError('INVALID_HUID') if the input is invalid.
 */
export function huidToByteArray(id: bigint): Uint8Array {
    if (id < 0n) {
        throw new HUIDError('INVALID_HUID')
    } else if (id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    const arr = new Uint8Array(8)
    const view = new DataView(arr.buffer)
    view.setBigUint64(0, id, false) // big-endian

    return arr
}

/**
 * Converts an 8-byte Buffer in big-endian format to a HUID bigint. Throws an
 * error if the buffer is not exactly 8 bytes long.
 *
 * Throws HUIDError('INVALID_HUID') if the input is invalid.
 */
export function huidFromBuffer(buf: Buffer): bigint {
    if (buf.length !== 8) {
        throw new HUIDError('INVALID_HUID')
    }

    const id = buf.readBigUInt64BE(0)

    if (id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    return id
}

export function huidFromByteArray(arr: Uint8Array): bigint {
    if (arr.length !== 8) {
        throw new HUIDError('INVALID_HUID')
    }

    const view = new DataView(arr.buffer, arr.byteOffset, arr.byteLength)
    const id = view.getBigUint64(0, false) // big-endian

    if (id > MAX_HUID_N) {
        throw new HUIDError('INVALID_HUID')
    }

    return id
}
