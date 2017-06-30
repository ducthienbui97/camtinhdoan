import React from 'react';
import {Grid, Col, Row} from 'react-flexbox-grid';

export default class Loading extends React.Component{
	render(){
	return (
      		 <Grid fluid>
                <Row center="xs" middle="xs">
                    <Col xs={10} md={10}>
                        <h1>Loading</h1>
                        <br></br>  
                        <img src="/loading.gif" alt="Loading" title="Loading" />
                    </Col>
                </Row>
            </Grid>  
        );
	}
}