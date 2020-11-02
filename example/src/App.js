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
const mode = urlParams.get('mode')

//example url
//http://localhost:3000/phone/react-sip-phone?name=testname&websocket=wss://test-websocket-01-us-east-5.test.com:5065
//&sipuri=user_test@test.domain.com&password=tEsTpAsSwOrD&features=callbuttonsettings&buttons=holdtransfermute

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
        }}
        phoneConfig={{
          disabledButtons: disabledButtons || '', // Will remove button(s) from Phone component. E.g. hold transfer dialpadopen mute '
          disabledFeatures: disabledFeatures || '', // Will remove feature(s) from application. E.g. settings remoteid
          defaultDial: '',          // (strict-mode only) the default destination. E.g. 1234567890
          sessionsLimit: 3,         // limits amount of sessions user can have active
          attendedTransferLimit: 2, // limits amount of attendedTransfer sessions user can have active
          autoAnswer: false         // enable the auto-answer on incoming calls
        }}
        appConfig={{
          mode: mode || '', // 'strict' will activate a simple and limited user experience. set to sessionLimit 1 if using 'strict'
          started: false, // (strict-mode only) keeps track of call button visability during strict-mode
          appSize: 'large' // assign 'large' for larger font in status-name and session-status (not session remote-id/display name)
        }}
        width={0}
      />
    </React.Fragment>
  )
}

export default App
