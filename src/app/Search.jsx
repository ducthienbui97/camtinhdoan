import queryString from 'query-string';
import React from 'react';
import {Grid, Col, Row} from 'react-flexbox-grid';
import axios from 'axios';
import {BlurDiv} from './Style.jsx'
import Loading from './Loading.jsx' 
export default class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            done: false,
            response: '',
            httpClient: axios.create({
              timeout: 300000
            })
        };
    }
    componentWillMount(){
        this.state.httpClient.post('/ask',{
            question: queryString.parse(this.props.location.search).query
        })
        .then((response) => {
            console.log("done");
            console.log(response);
            this.setState({done: true,response: response.data});
        });
    }

    render(){
    	if(this.state.done){
	        return (
	      		 <Grid fluid>
	                <Row middle="xs">
	                    <Col xsOffset={1}  xs={10} >
	                        <BlurDiv dangerouslySetInnerHTML={{ __html: this.state.response }} /> 
	                    </Col>
	                </Row>
	            </Grid>  
	        );
	    }
	    else{
	    	return <Loading/>
	    }
    }
}