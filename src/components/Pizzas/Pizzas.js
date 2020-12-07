import React from "react";
import './Pizzas.css';
import { connect } from 'react-redux';
import {
  setCurrency,
  addToCart
} from '../../actions/pizzaActions';
import Config from "../../Config";

const mapStateToProps = ({ output }) => ({
  output
});

function Factory(props) {
  return <article className="pizza">
            <main className="pizza__vertical">
                <figure className="pizza__vertical__image" >
                    <img className="pizza__vertical__image_img" alt={props.component.title} src={props.component.imgpath} />
                </figure>
                <h2 className="pizza__vertical__title">{props.component.title}</h2>
                <p className="pizza__vertical_description">{props.component.description}</p>
            </main>
            <footer className="pizza__horizontal">
                <p className="pizza__horizontal__description">From {props.component.cost}</p>
                <div className="pizza__horizontal__description__buttons">
                    <button id={props.component.id} onClick={props.chooseItem} className="pizza__horizontal__description__buttons_button" type="submit" value="sign-in">
                        Choose
                    </button>
                </div>
            </footer>
        </article>
}

class Pizzas extends React.Component {
    state = {
        pizzas: {
            items: []
        }
    }
    choose = (e) => {
        this.props.addToCart(e.target.id);
    };

    componentDidMount () {
        async function getAssorment() {
            let response = await fetch(Config.proto + '://' + Config.server + ':' + Config.port + '/assortment', {
                method: 'GET',
                mode: "cors",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        }
        getAssorment().then( data => this.setState({pizzas: data}))
        
    }

    render() {
        return (
            <div className="pizzas">
                {Object.keys(this.state.pizzas).length ? 
                    this.state.pizzas.items.map(item => (
                        <Factory key={item.id + "_id"} chooseItem={this.choose} component={item} />
                        ))
                 : ""}
            </div>
        );
    }
}                               

export default connect(mapStateToProps, {
  setCurrency,
  addToCart
})(Pizzas);