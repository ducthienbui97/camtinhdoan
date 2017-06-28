import React from 'react';
import {render} from 'react-dom';
import Input from './style.jsx';
class Main extends React.Component{
	render(){
		
		return (

			<div> 
				<form >
					<input type="text" name="query"></input>
				</form>
			</div>
		);
	}
}
render(<Main/> , document.getElementById('app'));