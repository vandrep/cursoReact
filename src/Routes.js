import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import AutorBox from './Autor';
import LivroBox from './Livro';
import Home from './Home';

export const Routes = () => {
    return (
        <App>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={LivroBox} />
            </Switch>
        </App>
    )
}