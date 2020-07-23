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
          dialstring: true || false
        }}
        phoneConfig={{
          disabledButtons: disabledButtons || '', // Will remove button from Phone component. E.g. hold transfer dialpadopen mute '
          disabledFeatures: disabledFeatures || '', // Will remove feature from application. E.g. callbutton settings remoteid
          defaultDial: '',          //for use with callbutton disabled only. E.g. 1234567890
          sessionsLimit: 1,         // limits amount of sessions user can have active   
          attendedTransferLimit: 1  // limits amount of attendedTransfer sessions user can have active     
        }}
        appConfig={{
          mode: mode || '', //strict mode for use with callbutton disabled and sessionLimit set to 1
          started: false    //keeps track of call button visability
        }}
        width={0}
      />
    </React.Fragment>
  )
}

export default App
