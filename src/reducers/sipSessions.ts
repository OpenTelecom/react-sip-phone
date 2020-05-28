import { Action } from './models'
import { NEW_SESSION } from '../actions/sipSessions'
const sipSessions = (state = {
  sessions: []
}, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state, session: [...state.sessions, payload]
      }
    default:
      return state
  }
}
export default sipSessions