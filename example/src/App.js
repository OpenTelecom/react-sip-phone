import React from 'react'

import { ReactSipPhone, reactSipPhoneReducers } from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

const App = () => {
  return <ReactSipPhone
    name="John Smith"
    sipCredentials={{
      sipuri: 'user_EYrB693q6Z@sip.reper.io',
      password: 'J8wKwN5YUYtv'
    }}
    sipConfig={{ websocket: 'wss://kazoo-sbc-01-us-west-1.reper.io:5065' }} width={400} />
}

export default App
