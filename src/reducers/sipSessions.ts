import { Action } from './models'
import { NEW_SESSION, SIPSESSION_ESTABLISHED } from '../actions/sipSessions'
const sipSessions = (
  state = {
    sessions: []
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state,
        sessions: [...state.sessions, payload]
      }
    case SIPSESSION_ESTABLISHED:
      return {
        ...state,
        sessions: [...state.sessions, payload]
      }
    default:
      return state
  }
}
export default sipSessions
