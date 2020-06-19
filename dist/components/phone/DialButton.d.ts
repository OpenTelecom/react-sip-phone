/// <reference types="react" />
interface Props {
    text: string;
    click: Function;
    letters: string;
}
declare const DialButton: ({ text, click, letters }: Props) => JSX.Element;
export default DialButton;
