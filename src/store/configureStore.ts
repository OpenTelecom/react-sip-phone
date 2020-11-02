import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from '../reducers/index'

const middleware = [thunk]

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['device']
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const defaultStore = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)
export const persistor = persistStore(defaultStore)
