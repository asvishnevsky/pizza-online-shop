import React, {useState} from "react";
import './Registration.css';
import Config from "../../Config";
import {Link} from "react-router-dom";

function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeated, setPasswordRepeated] = useState('');

    const submit = async () => {
        await fetch(Config.proto + '://' + Config.server + ':' + Config.port + '/register', {
            method: 'POST',
            mode: "cors",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password
            }),
        });
    };

    return (
        <div className="registration">
            <form className="registration_form" name="registration_form">
                <div className="registration_form__name">
                    <label className="registration_form__name_label">Your name</label>
                    <input type="name"
                           className="registration_form__name_input"
                           name="name"
                           autoComplete="John Doe"
                           placeholder="John Doe"
                           value={name}
                           onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="registration_form__email">
                    <label className="registration_form__email_label">Email</label>
                    <input type="email"
                           className="registration_form__email_input"
                           name="email"
                           autoComplete="home email"
                           placeholder="johndoe@example.com"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="registration_form__password">
                    <label className="registration_form__password_label">Password</label>
                    <input type="password"
                           className="registration_form__password_input"
                           placeholder="8+ symbols"
                           name="password"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="registration_form__password">
                    <label className="registration_form__password_label">Password (Again)</label>
                    <input type="password"
                           className="registration_form__password_input"
                           placeholder="Helps prevent typos"
                           name="password"
                           value={passwordRepeated}
                           onChange={e => setPasswordRepeated(e.target.value)}
                    />
                </div>
                <div className="registration_form__options">
                    <label className="registration_form__options__remember">
                        <input className="registration_form__options__remember__checkbox" checked="checked" type="checkbox" />
                        <span className="registration_form__options__remember_span">
                            I've read and agreed
                            <Link className="registration_form__options__remember_span__link" to="/privacy">Privacy Policy</Link>
                        </span>
                    </label>
                </div>
                <div className="registration_form__buttons">
                    <button className="registration_form__buttons__sign-in" type="button" value="sign-in" onClick={submit}>Sign Up</button>
                    <Link className="registration_form__buttons__create-account" to="/login">I have an account</Link>
                </div>
            </form>
        </div>
    );
}

export default Registration;
