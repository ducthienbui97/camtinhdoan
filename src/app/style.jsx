import styled from 'styled-components';

const Div = styled.div`
	width: 50%;
	margin: 0 auto;
`
const H1 = styled.h1`
	text-align: center;
`
const P = styled.p`
	text-align: center;
`
const RightBubble = styled.div`
	max-width: 60%;
	margin-right: 0;
	margin-left: auto;
	margin-bottom: 10px;
	text-align: right;
	background : cyan;
	display: table;
	padding: 10px;
`

const LeftBubble = styled.div`
	max-width: 60%;
	margin-right: auto;
	margin-left: 0;
	margin-bottom: 10px;
	text-align: left;
	background : salmon;
	display: table;
	padding: 10px;
`
const Input = styled.input`
	padding:5px; 
    border:2px solid #ccc; 
    -webkit-border-radius: 5px;
    border-radius: 5px;
`
export {Div,H1,P,RightBubble,LeftBubble,Input}