# react-sip-phone

> SIP phone component for use in react projects

[![NPM](https://img.shields.io/npm/v/react-sip-phone.svg)](https://www.npmjs.com/package/react-sip-phone) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-sip-phone
```

## Usage

```tsx
import React, { Component } from 'react'

import { ReactSipPhone } from 'react-sip-phone'
import 'react-sip-phone/dist/index.css'

class Example extends Component {
  render() {
    return <ReactSipPhone
        name={name}
        sipCredentials={{
          sipuri: sipuri,
          password: password
        }}
        sipConfig={{
          websocket: websocket,
          defaultCountryCode: '1'
        }}
        width={400}
      />
  }
}
```

To make calls from outside of the component, import the phone's store and access the SIP Account once it is registered

```tsx
import { ReactSipPhone, phoneStore } from 'react-sip-phone'
class MyApp extends Component {

  makeCall(number) {
    const sipAccount = phoneStore.getState().sipAccounts.sipAccount
    if (sipAccount && number) {
      sipAccount.makeCall(number)
    }
  }

  render() {
    return <ReactSipPhone ... />
  }
}
```

## License

MIT
