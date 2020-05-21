import * as React from 'react'
import Dialpad from './phone/Dialpad'


class Phone extends React.Component {
  state = {
    dialpadOpen: false
  }
  render() {
    const state = this.state
    return <div>
      <Dialpad open={state.dialpadOpen} />
    </div>
  }
}

export default Phone