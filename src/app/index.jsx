import React from 'react';
import {render} from 'react-dom';
import {Input} from './style.jsx';
class Main extends React.Component{
	render(){
		
		return (

			<div> 
				<form >
					<Input type="text" name="query"></Input>
				</form>
			</div>
		);
	}
}
render(<Main/> , document.getElementById('app'));