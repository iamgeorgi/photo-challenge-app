import React from "react";
import { useAuth } from '../../../custom-hooks/authContext.js';
import { useState } from 'react';
import decode from 'jwt-decode';
import { setToken } from './../../../common/token-handlers.js';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Swal from 'sweetalert2';


const Login = (props) => {
    const { setUser } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = (e) => {
        e.preventDefault();

        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(r => r.json())
            .then((data) => {
                if (data.message) {
                    Swal.fire({
                        icon: 'error',
                        confirmButtonColor: '#C19B76',
                        text: data.message
                      })
                } else {
                    setToken(data.token);
                    const user = decode(data.token);
                    setUser(user);
                    props.history.push('/contests/phaseone');
                }
            })
    };

    return (
        <div className="container col-6">
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        aria-describedby="emailHelp"
                        placeholder="Enter username"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter Password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-center">
                    <button onClick={login} className="btn btn-primary">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};
Login.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
  };

export default withRouter(Login);
