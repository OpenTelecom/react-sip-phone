export const NEW_SESSION = 'NEW_SESSION'
export const SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE'
export const CLOSE_SESSION = 'CLOSE_SESSION'
export const HOLD_SESSION = 'HOLD_SESSION'
export const UNHOLD_SESSION = 'UNHOLD_SESSION'

export const endCall = (sessionId: string) => {
  return { type: CLOSE_SESSION, payload: sessionId }
}

export const holdCall = (sessionId: string) => {
  return { type: HOLD_SESSION, payload: sessionId }
}

export const unHoldCall = (sessionId: string) => {
  return { type: UNHOLD_SESSION, payload: sessionId }
}
