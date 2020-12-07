import React from 'react';
import {
  HashRouter as Router
} from "react-router-dom";
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import pizzaReducers from './reducers/pizzaReducers';
import './App.css';
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Config from "./Config";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(pizzaReducers, composeEnhancer(applyMiddleware(thunk)));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorized: false
        };
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        fetch(Config.proto + '://' + Config.server + ':' + Config.port + '/protected', {
          method: 'GET',
          mode: "cors",
          credentials: "include",
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
        }).then(response => response.json())
            .then(
                data => {
                    if (data.user_id === undefined)
                        this.setState({title: "Vulnerable"});
                    else {
                        this.setState({title: data.user_id});
                    }
                    document.title = this.state.title;
                    this.setState({authorized: data.authenticated});
                });
    }



    update() {
        fetch(Config.proto + '://' + Config.server + ':' + Config.port + '/protected', {
            method: 'GET',
            mode: "cors",
            credentials: "include",
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
        }).then(response => response.json())
            .then(
                data => {
                    if (data.user_id === undefined)
                        this.setState({title: "Vulnerable"});
                    else
                        this.setState({title: data.user_id});
                    document.title = this.state.title;
                    this.setState({authorized: data.authenticated});
                });
    }

    render() {
        if (this.state.authorized) {
            return (
                <Provider store={store}>
                    <Router>
                        <div className="App">
                            Congratulations! You have logged in!
                            <Header />
                            <Content />
                        </div>
                    </Router>
                </Provider>
            );
        } else {
            return (
                <Provider store={store}>
                    <Router>
                        <div className="App">
                            <Header />
                            <Content />
                        </div>
                    </Router>
                </Provider>
            );
        }

    }
}

export default App;
