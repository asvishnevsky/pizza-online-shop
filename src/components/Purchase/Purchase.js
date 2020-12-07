import React, {useState} from "react";
import './Purchase.css';
import Config from "../../Config";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';

const mapStateToProps = ({ cart }) => ({
  cart
});

class Purchase extends React.Component {
    state = {
      name: "",
      email: "",
      phone: "",
      address: ""
    }

    setName (e) {
      this.setState({name: e.target.value})
    }

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
        <div className="purchase">
            <h1 className="cart__order__title">Your order</h1>
            <ul className="cart__order">
                    {rows}
                </ul>
            <hr className="purchase_hr" />
            <form className="purchase_form" name="purchase_form">
                <div className="purchase_form__name">
                    <label className="purchase_form__name_label">Your name</label>
                    <input type="name"
                           className="purchase_form__name_input"
                           name="name"
                           autoComplete="John Doe"
                           placeholder="John Doe"
                           value={this.state.name}
                           onChange={this.setName}
                    />
                </div>
                <div className="purchase_form__email">
                    <label className="purchase_form__email_label">Email</label>
                    <input type="email"
                           className="purchase_form__email_input"
                           name="email"
                           autoComplete="home email"
                           placeholder="johndoe@example.com"
                           value={this.state.email}
                           onChange={e => alert(e.target.value)}
                    />
                </div>
                <div className="purchase_form__phone">
                    <label className="purchase_form__phone_label">Phone</label>
                    <input type="phone"
                           className="purchase_form__phone_input"
                           name="phone"
                           autoComplete="Your phone"
                           placeholder="+7 (***) ** - **"
                           value={this.state.phone}
                           onChange={e => alert(e.target.value)}
                    />
                </div>
                <div className="purchase_form__address">
                    <label className="purchase_form__address_label">Address</label>
                    <input type="address"
                           className="purchase_form__address_input"
                           name="address"
                           autoComplete="Your address"
                           placeholder="City, street, building, appartment"
                           value={this.state.address}
                           onChange={e => alert(e.target.value)}
                    />
                </div>

                <div className="purchase_form__options">
                  <label className="purchase_form__options_label">Payment</label>
                  <fieldset id="purchase_form__options_fieldset">
                      <input className="purchase_form__options__remember__radio" type="radio" checked={true}/>
                      <span className="purchase_form__options__remember_span">
                          Pay in cash
                      </span>
                      <input className="purchase_form__options__remember__radio" type="radio" />
                      <span className="purchase_form__options__remember_span">
                          Banking card
                      </span>
                      <input className="purchase_form__options__remember__radio" type="radio" />
                      <span className="purchase_form__options__remember_span">
                          Online payment
                      </span>
                  </fieldset>
                </div>
                
                <div className="purchase_form__buttons">
                    <button className="purchase_form__buttons__complete" type="button" value="sign-in">Purchase</button>
                </div>
            </form>
        </div>
    )}
}

export default connect(mapStateToProps, {
})(Purchase);

