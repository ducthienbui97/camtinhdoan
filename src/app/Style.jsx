import Style from 'styled-components'
import {Link} from 'react-router-dom';
import {Row} from 'react-flexbox-grid';
const NoneDecorateLink = Style(Link)`
    text-decoration: none;
`
const SearchRow = Style(Row)`
    display:flex;
    position:realtive;
    margin:5em auto;
    width: 90%;
    flex-direction:row;
    button {
      background-color:rgb(194, 17, 14);
      color:rgba(222, 225, 29, 0.5);
      display:block;
      font:1.2em 'Montserrat Alternates';
      padding:0.6em 0.8em;
      border:none;
    }
    input[type=text] {
      flex:1;
      padding:0.6em;
    }
    button:hover {
      background-color:rgba(194, 17, 14, 0.1);
      color:rgba(222, 225, 29, 0.5);
      border:1em;
    }
    button:active {
      background-color:rgba(194, 17, 14, 0.1);
      color:rgba(222, 225, 29, 0.5);
      border:1em;
    }
`
const BlurDiv = Style.div`
	align: left !important;
	background-color: rgba(155,155,155,0.5);
    border-radius: 5px;
    padding: 10px;
    p{
    	margin: 0px;
    }
`
export {NoneDecorateLink,SearchRow,BlurDiv}