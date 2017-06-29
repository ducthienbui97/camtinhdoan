import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './Main.jsx';
import Search from './Search.jsx';
render(
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Main}/>
            <Route path="/search" component={Search}/>
        </Switch>
    </BrowserRouter>

 , document.getElementById('app'));