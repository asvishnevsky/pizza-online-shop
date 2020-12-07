import React from "react";
import './Content.css';
import {
    Switch, Route
} from "react-router-dom";
import Pizzas from "../Pizzas/Pizzas";
import Login from "../Login/Login";
import Registration from "../Registration/Registration";
import Purchase from "../Purchase/Purchase";
import { useLocation } from 'react-router-dom';

function Content() {
    const location = useLocation();
    return (
        <article className="content">
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/register">
                    <Registration />
                </Route>

                <Route path="/purchase">
                    <Purchase />
                </Route>

                <Route path="/">
                    <Pizzas />
                </Route>
            </Switch>
        </article>
    );
}

export default Content;