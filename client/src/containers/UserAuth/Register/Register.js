import React from "react";
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const Register = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const register = (e) => {
        e.preventDefault();

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, firstname, lastname, email })
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
                    Swal.fire({
                        title: 'Success',
                        toast: true,
                        position: 'top-end',
                        text: 'Welcome!',
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    props.history.push('/signin');
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
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        placeholder="Enter Firstname"
                        onChange={e => setFirstname(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        placeholder="Enter Lastname"
                        onChange={e => setLastname(e.target.value)}
                    />
                </div>
                <div className="text-center">

                    <button onClick={register} className="btn btn-primary">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

Register.propTypes = {
    history: PropTypes.any,
};

export default Register;
