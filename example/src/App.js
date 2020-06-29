import React, { useState } from 'react'

import { ReactSipPhone, phoneStore } from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

const urlParams = new URLSearchParams(window.location.search)
const sipuri = urlParams.get('sipuri')
const password = urlParams.get('password')
const websocket = urlParams.get('websocket')
const name = urlParams.get('name')

const disabledButtons = urlParams.get('buttons')
const disabledFeatures = urlParams.get('features')

const outsideComponentDial = urlParams.get('dial')

const App = () => {
  const [dialstring, setDialstring] = useState('')
  return (
    <React.Fragment>
      {outsideComponentDial ? <div>
        <input placeholder="Enter a number to dial"
          onChange={(e) => setDialstring(e.target.value)} />
        <button onClick={() => {
          if (phoneStore.getState().sipAccounts.sipAccount && dialstring) {
            phoneStore.getState().sipAccounts.sipAccount.makeCall(dialstring)
          }
        }}>Dial</button>
      </div> : null}
      <ReactSipPhone
        name={name || ''}
        sipCredentials={{
          sipuri: sipuri || '',
          password: password || ''
        }}
        sipConfig={{
          websocket: websocket || '',
          defaultCountryCode: '1',
          dialstring: true || false

        }}
        phoneConfig={{
          disabledButtons: disabledButtons || '',
          disabledFeatures: disabledFeatures || ''
        }}
        width={0}
      />
    </React.Fragment>
  )
}

export default App
