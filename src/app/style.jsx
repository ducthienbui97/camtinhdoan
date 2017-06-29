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
      display:block;
      font:1.2em 'Montserrat Alternates';
    }
    input[type=text] {
      flex:1;
      padding:0.6em;
    }
    button {
      padding:0.6em 0.8em;
      border:none;
    }
    button:hover {
      border:1em;
    }
    button:active {
      background-color:rgb(26, 255, 200);
      color:white;
      border:1em;
    }
`
export {NoneDecorateLink,SearchRow}