import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../utils/auth';

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Use AuthService to perform login
      const { userId } = await AuthService.login(formState);
      // Set user ID to local storage and redirect to home
      localStorage.setItem('userId', userId);
      window.location = '/';
    } catch (error) {
      setError(error.message);
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

  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2 className='signup-title'>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleFormSubmit} className='form-container'>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email:</label>
          <input
            className='email-input'
            placeholder="youremail@test.com"
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
      </form>
    </div>
  );
}

export default Login;
