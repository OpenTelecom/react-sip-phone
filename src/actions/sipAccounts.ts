import SIPAccount from "../lib/SipAccount"

export const SIPACCOUNT_UNREGISTERED = 'SIPACCOUNT_UNREGISTERED'
export const NEW_USERAGENT = 'NEW_USERAGENT'
export const NEW_ACCOUNT = 'NEW_ACCOUNT'

export const setNewAccount = (account: SIPAccount) => {
  return { type: NEW_ACCOUNT, payload: account }
}