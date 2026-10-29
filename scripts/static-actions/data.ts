// Stand-ins for app/actions/data.ts in the static demo, which has no server to save to.
export type ActionResult = { ok?: string; error?: string }

const readOnly = async (..._args: unknown[]): Promise<ActionResult> => ({ error: 'This is a read-only demo.' })

export const createRequest = readOnly
export const updateRequest = readOnly
export const createVisitor = readOnly
export const setVisitorStatus = readOnly
export const createNotice = readOnly
export const deleteNotice = readOnly
export const createLedgerEntry = readOnly
export const deleteLedgerEntry = readOnly
export const vote = readOnly
export const createPoll = readOnly
export const createBooking = readOnly
export const cancelBooking = readOnly
export const recordPayment = readOnly
export const recordBillRun = readOnly
