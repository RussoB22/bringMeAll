import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import AuthService from '../utils/auth';
const hostServer = 'https://pure-meadow-61870-2db53a3c769f.herokuapp.com/';

function Signup(props) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if(formState.password.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }
    try {
      const response = await signupAPI(formState);
      window.location = '/';
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const signupAPI = async (formData) => {

    // Perform your API call here and return the response
    const response = await fetch(`${hostServer}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();
    return data;
  };

  return (
    <div className="container my-1 ">
      <Link to="/login">← Go to Login</Link>

      <h2 className='signup-title'>Signup</h2>
      <form onSubmit={handleFormSubmit} className='form-container'>
        <div className='form-group'>
          <div className="flex-row space-between my-2">
            <label htmlFor="userName">Username:</label>
            <input
              placeholder="Username"
              name="username"
              type="text"
              id="userName"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="firstName">First Name:</label>
            <input
              placeholder="First"
              name="firstName"
              type="text"
              id="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="lastName">Last Name:</label>
            <input
              placeholder="Last"
              name="lastName"
              type="text"
              id="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="email">Email:</label>
            <input className='email-input'
              placeholder="email@test.com"
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="pwd">Password:</label>
            <input
              placeholder="******"
              name="password"
              type="password"
              id="pwd"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row flex-end">
            <button type="submit" className='custom-button'>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;