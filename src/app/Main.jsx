import React from 'react';
import queryString from 'query-string';
import {FieldTextStateless as FieldText} from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import {Grid, Col} from 'react-flexbox-grid';
import {NoneDecorateLink,SearchRow} from './Style.jsx';
import ReactKeymaster from 'react-keymaster';

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {value:''};
        this.startSearch = this.startSearch.bind(this);
    }

    startSearch(){
        const searchLocation = {
                                pathname: '/search',
                                search: queryString.stringify({
                                    query: this.state.value
                                    })
                                }
        this.props.history.push(searchLocation);
    }
    render(){
        return (
            <Grid fluid>
                <SearchRow center="xs" middle="xs">
                    <Col xs={10} md={8}>
                        <ReactKeymaster keyName="enter" onKeyDown={this.startSearch}/>
                        <FieldText
                            placeholder="Nhập câu hỏi"
                            label="Search query"
                            isLabelHidden
                            shouldFitContainer
                            onChange = {(e) => this.setState({value:e.target.value})}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button appearance='primary' onClick = {this.startSearch}> Generate </Button>
                    </Col>
                </SearchRow>
            </Grid>
        );
    }
}