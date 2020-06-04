import * as React from 'react'
import { Invitation } from 'sip.js'

interface Props {
  session: Invitation,
}

const Incoming = ({ session }: Props) => {
  console.log(session)
  return <div id="sip-incoming">
    Incoming
  </div>
}

export default Incoming