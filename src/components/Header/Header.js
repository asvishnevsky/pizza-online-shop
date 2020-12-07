import React from "react";
import './Header.css';
import Menu from "../Menu/Menu";
import {
    Link
} from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <div className="header__container__title">
                    <Link className="header__container__title__link" to="/">
                         Pizza Online-Shop
                    </Link>
                </div>
                <Menu />
            </div>

        </header>
    );
}

export default Header;