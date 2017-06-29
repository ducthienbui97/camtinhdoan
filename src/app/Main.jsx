import React from 'react';
import queryString from 'query-string';
import {FieldTextStateless as FieldText} from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import {Grid, Row, Col } from 'react-flexbox-grid';
import {NoneDecorateLink} from './Style.jsx';
export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {value:''};
    }
    render(){
        return (
            <Grid fluid>
                <Row center="xs">
                    <Col xs={9} md={7} lg={5}>
                        <FieldText
                            placeholder="Nhập câu hỏi"
                            label="Search query"
                            isLabelHidden
                            shouldFitContainer
                            onChange = {(e) => this.setState({value:e.target.value})}
                        />
                    </Col>
                    <Col xs={2}>
                        <NoneDecorateLink to={{
                            pathname: '/search',
                            search: queryString.stringify({
                                query: this.state.value
                                })
                        }}> 
                            <Button> Generate </Button>
                        </NoneDecorateLink>
                    </Col>
                </Row>
            </Grid>
        );
    }
}