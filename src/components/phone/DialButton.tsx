import * as React from 'react'

interface Props {
  text: string,
  click: Function,
  style?: any
}

const DialButton = ({ text, click, style = {} }: Props) => {
return <div onClick={click()} style={style}>{text}</div>
}

export default DialButton