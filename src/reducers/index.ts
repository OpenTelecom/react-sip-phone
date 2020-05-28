import { combineReducers } from 'redux'
import sipSessions from './sipSessions'
import sipAccounts from './sipAccounts'

const reducers: any = combineReducers({sipAccounts, sipSessions})

export default reducers