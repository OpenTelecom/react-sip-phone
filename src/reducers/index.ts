import { combineReducers } from 'redux'
import sipSessions from './sipSessions'
import sipAccounts from './sipAccounts'
import device from './device'

const reducers: any = combineReducers({ sipAccounts, sipSessions, device })

export default reducers