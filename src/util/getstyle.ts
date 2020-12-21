export const GetStyleSize = (
  appSize: string,
  propname: string,
  styles: any
) => {
  // Default Large
  let StyleSelected = `${propname}Large`
  if (appSize === 'large') {
    StyleSelected = `${propname}Large`
  } else if (appSize === 'medium') {
    StyleSelected = `${propname}Medium`
  } else if (appSize === 'small') {
    StyleSelected = `${propname}Small`
  }
  return styles[StyleSelected]
}
