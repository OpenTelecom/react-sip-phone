import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers/index'

const middleware = [thunk]

const defaultStore = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default defaultStore
