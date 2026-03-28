import { HUIDError } from './error'
import { huidDecodeTime } from './time'

export interface HUIDValidatorOptions {
    /**
     * Whether to disallow HUIDs that are in the future (after the current
     * time).
     *
     * @default false
     */
    disallowFuture?: boolean

    /**
     * Whether to disallow HUIDs that are before a certain date. Can be a Date
     * object or a HUID with a time component that represents the date.
     *
     * The check is not strict meaning that if the HUID's time component is
     * exactly equal to the disallowBefore date (in miliseconds), it will be
     * considered valid.
     */
    disallowBefore?: Date | bigint

    /**
     * Whether to disallow HUIDs that are after a certain date. Can be a Date
     * object or a HUID with a time component that represents the date.
     *
     * The check is not strict meaning that if the HUID's time component is
     * exactly equal to the disallowAfter date (in miliseconds), it will be
     * considered valid.
     */
    disallowAfter?: Date | bigint
}

function _normalizeDate(date: Date | bigint): Date {
    if (date instanceof Date) {
        return date
    } else if (typeof date === 'bigint') {
        return huidDecodeTime(date)
    } else {
        throw new HUIDError('TYPE_ERROR')
    }
}

/**
 * Returns a function that validates whether a given bigint is a valid HUID.
 * The validator checks if the input is a bigint and falls within the valid
 * range of HUIDs (0 to 2^63 - 1). Additional options can be provided to
 * disallow HUIDs that are in the future or outside of a specified date range.
 */
export const huidValidator = (options?: HUIDValidatorOptions) => {
    let disallowAfter: Date | null = options?.disallowFuture ? new Date() : null

    if (options?.disallowAfter) {
        if (disallowAfter !== null && options.disallowAfter < disallowAfter) {
            disallowAfter = _normalizeDate(options.disallowAfter)
        }
    }

    let disallowBefore: Date | null = null

    if (options?.disallowBefore) {
        disallowBefore = _normalizeDate(options.disallowBefore)
    }

    return (id: bigint): boolean => {
        try {
            // this function throws if the input is not a bigint or if the
            // value is out of bounds
            const time = huidDecodeTime(id)

            if (disallowAfter !== null && time > disallowAfter) {
                return false
            }

            if (disallowBefore !== null && time < disallowBefore) {
                return false
            }

            return true
        } catch (_: unknown) {
            return false
        }
    }
}
