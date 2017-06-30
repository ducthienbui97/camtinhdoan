import queryString from 'query-string';
import React from 'react';
import {Grid, Col, Row} from 'react-flexbox-grid';
import axios from 'axios';
import {BlurDiv} from './Style.jsx'
export default class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            done: false,
            response: '<h1>Loading</h1><br></br>  <img src="/loading.gif" alt="Loading" title="Loading" />'
        };
    }
    componentWillMount(){
        axios.post('/ask',{
            question: queryString.parse(this.props.location.search).query
        })
        .then((response) => {
            console.log("done");
            console.log(response);
            this.setState({done: true,response: response.data});
        });
    }
    render(){
        return (
      		 <Grid fluid>
                <Row center="xs" middle="xs">
                    <Col xs={10} md={10}>
                        <BlurDiv dangerouslySetInnerHTML={{ __html: this.state.response }} /> 
                    </Col>
                </Row>
            </Grid>  
        );
    }
}