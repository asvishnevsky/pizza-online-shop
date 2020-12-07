import React, {useState} from "react";
import './Login.css';
import Config from "../../Config";
import {Link} from "react-router-dom";

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const submit = async () => {
        await fetch(Config.proto + '://' + Config.server + ':' + Config.port + '/login', {
            method: 'POST',
            mode: "cors",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": login,
                "password": password
            }),
        });
    };

    return (
        <div className="login">
            <form className="login_form" name="login_form">
                <div className="login_form__email">
                    <label className="login_form__email_label">Email</label>
                    <input type="email"
                           className="login_form__email_input"
                           name="email"
                           autoComplete="home email"
                           placeholder="johndoe@example.com"
                           value={login}
                           onChange={e => setLogin(e.target.value)}
                    />
                </div>
                <div className="login_form__password">
                    <label className="login_form__password_label">Password</label>
                    <input type="password"
                           className="login_form__password_input"
                           placeholder="Nobody knows"
                           name="password"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="login_form__options">
                    <label className="login_form__options__remember">
                        <input className="login_form__options__remember__checkbox" checked="checked" type="checkbox" />
                        <span className="login_form__options__remember_span">Remember me</span>
                    </label>
                    <div className="login_form__options__forgot">
                        <button className="login_form__options__forgot_button">Forgot password?</button>
                    </div>
                </div>
                <div className="login_form__buttons">
                    <button className="login_form__buttons__sign-in" type="button" value="sign-in" onClick={submit}>Sign in</button>
                    <Link className="login_form__buttons__create-account" to="/register">Create an account</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
