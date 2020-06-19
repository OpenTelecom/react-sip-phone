import { combineReducers } from 'redux'
import sipSessions from './sipSessions'
import sipAccounts from './sipAccounts'
import device from './device'
import config from './config'

const reducers: any = combineReducers({ sipAccounts, sipSessions, device, config })

export default reducers