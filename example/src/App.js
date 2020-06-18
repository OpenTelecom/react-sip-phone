import React from 'react'

import { ReactSipPhone, reactSipPhoneReducers } from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

const urlParams = new URLSearchParams(window.location.search)
const sipuri = urlParams.get('sipuri')
const password = urlParams.get('password')
const websocket = urlParams.get('websocket')
const name = urlParams.get('name')

const App = () => {
  return (
    <ReactSipPhone
      name={name || ''}
      sipCredentials={{
        sipuri: sipuri || '',
        password: password || ''
      }}
      sipConfig={{
        websocket: websocket || '',
        defaultCountryCode: '1'
      }}
      width={0}
    />
  )
}

export default App
