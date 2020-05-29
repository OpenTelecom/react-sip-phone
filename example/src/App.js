import React from 'react'

import { ReactSipPhone, reactSipPhoneReducers } from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

const urlParams = new URLSearchParams(window.location.search);
const sipuri = urlParams.get('sipuri')
const password = urlParams.get('password')
const websocket = urlParams.get('websocket')
const name = urlParams.get('name')

const App = () => {
  return <ReactSipPhone
    name={name || "Jason Lu"}
    sipCredentials={{
      sipuri: sipuri || 'user_5Mx2k54qRf@sip.reper.io',
      password: password || 'uYtbDuAmMJXW'
    }}
    sipConfig={{ websocket: websocket || 'wss://kazoo-sbc-01-us-west-1.reper.io:5065' }} width={400} />
}

export default App
