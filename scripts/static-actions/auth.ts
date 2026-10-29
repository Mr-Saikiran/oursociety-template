// Stand-ins for app/actions/auth.ts in the static demo, which has no accounts.
export type FormState = { error?: string; ok?: string } | undefined

const readOnly = async (..._args: unknown[]): Promise<FormState> => ({ error: 'This is a read-only demo.' })

export const login = readOnly
export const logout = readOnly
export const setupAdmin = readOnly
export const addMember = readOnly
export const updateRole = readOnly
export const removeMember = readOnly
export const changePassword = readOnly
