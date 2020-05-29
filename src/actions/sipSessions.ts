export const NEW_SESSION = 'NEW_SESSION'
export const SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE'
export const CLOSE_SESSION = 'CLOSE_SESSION'

export const endCall = (sessionId: string) => {
  return { type: CLOSE_SESSION, payload: sessionId }
}