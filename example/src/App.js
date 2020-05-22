import React from 'react'

import { ReactSipPhone, reactSipPhoneReducers} from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

const App = () => {
  return <ReactSipPhone name="John Smith" sipCredentials={{}} sipConfig={{}} width={400}/>
}

export default App
