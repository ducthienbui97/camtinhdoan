import queryString from 'query-string';
import React from 'react';

export default class Search extends React.Component{
	render(){
		return <h1>Query: {queryString.parse(this.props.location.search).query}</h1>
	}
}