export const getButtonLetters = (value: string) => {
  switch (value) {
    case '1':
      return '1'
    case '2':
      return 'ABC'
    case '3':
      return 'DEF'
    case '4':
      return 'GHI'
    case '5':
      return 'JKL'
    case '6':
      return 'MNO'
    case '7':
      return 'PQRS'
    case '8':
      return 'TUV'
    case '9':
      return 'WXYZ'
    case '0':
      return '+'
    default:
      return ''
  }
}
