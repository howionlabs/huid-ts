export type HUIDErrorCode =
    | 'HUID_OVERFLOW'
    | 'HUID_UNDERFLOW'
    | 'INVALID_HUID'
    | 'TIME_OVERFLOW'
    | 'TIME_UNDERFLOW'
    | 'TYPE_ERROR'

export class HUIDError extends Error {
    override readonly name: HUIDErrorCode
    override readonly cause: HUIDErrorCode
    readonly code: HUIDErrorCode

    constructor(code: HUIDErrorCode) {
        super('')

        this.name = code
        this.code = code
        this.cause = code

        // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, HUIDError.prototype)
    }
}
