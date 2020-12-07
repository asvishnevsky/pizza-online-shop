import React from "react";
import './Menu.css';
import {
    Link
} from "react-router-dom";
import { connect } from 'react-redux';
import {
  setCurrency
} from '../../actions/pizzaActions';

const mapStateToProps = ({ cart }) => ({
  cart
});

class Menu extends React.Component {
    state = {
        currency: 'USD',
        cartClicked: false,
        display_cart_mode: "__hidden"
    };
    toggleCart = (e) => {
        if (this.state.display_cart_mode === "")
           this.setState({display_cart_mode: "__hidden"})
        else
           this.setState({display_cart_mode: ""})
    };

    changeCurrency = (e) => {
        this.props.setCurrency(e.target.value);
        this.setState({currency: e.target.value})
    };

    render () {
        const rows = Object.keys(this.props.cart).map((key) => 
            <li className="cart__order__item">
                <span className="cart__order__item__name"> {key}</span> 
                <span className="cart__order__item__count">
                    <span className="cart__order__item__count__button">-</span> 
                    <span className="cart__order__item__count__number">{this.props.cart[key]} </span>
                    <span className="cart__order__item__count__button">+</span> 
                </span>
            </li> )
        return (
            <div className="menu">
                <select onChange={this.changeCurrency} className="menu__currency">
                    <option>EUR</option>
                    <option>USD</option>
                </select>
                <Link className="menu__login" to="/login">
                    <svg className="menu__login_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24px" height="24px">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="menu__login_span">Login</span>
                </Link>
                <Link className="menu__history" to="/history">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24px" height="24px">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span className="menu__history_span">History</span>
                </Link>
                <div onClick={this.toggleCart} className="menu__cart">
                    <button className="menu__cart_button">
                        <span className="menu__cart_button_span">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24px" height="24px">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                            </svg>
                        </span>
                        <span className="menu__cart_span">Cart</span>
                        <span className="menu__cart_span__rigth" >0</span>
                    </button>
                </div>
            <div className={"cart" + this.state.display_cart_mode}>
                <ul className="cart__order">
                    {rows}
                </ul>
                <Link to="/purchase">
                    <button className="cart__purchase_button">Buy</button>
                </Link>
            </div>
        </div>
        );    
    }
}

export default connect(mapStateToProps, {
  setCurrency
})(Menu);