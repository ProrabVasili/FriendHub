import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      errorMessage: null,
      redirectToMain: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
  
    const { username, email, password, confirm_password } = this.state;
  
    if (password !== confirm_password) {
      this.setState({ errorMessage: 'Passwords do not match' });
      return;
    }
  
    // Check if geolocation access is granted
    if (!navigator.geolocation) {
      this.setState({ errorMessage: 'Geolocation is not supported by your browser' });
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
  
        try {
          const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email,
              password,
              location: [longitude, latitude]
            })
          });
  
          const data = await response.json();
          if (response.ok) {
            this.setState({ redirectToMain: true });
          } else {
            this.setState({ errorMessage: data.message });
          }
        } catch (error) {
          console.error('Error:', error);
          this.setState({ errorMessage: 'An error occurred. Please try again later.' });
        }
      },
      error => {
        // Geolocation access denied or error occurred
        this.setState({ errorMessage: 'Please allow geolocation access to sign up' });
      }
    );
  }
  

  render() {
    if (this.state.redirectToMain) {
      return <Navigate to="/main" />;
    }

    return (
      <div className="container">
        <div className="form-container">
          <h1>Sign Up to FriendHub</h1>
          <form id="signup-form" className="form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={this.state.confirm_password}
              onChange={this.handleChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p className="form-footer">Already have an account? <Link to="/login">Login</Link></p>
          {this.state.errorMessage ? (
            <div id="errorMessage" className="error-message" style={{ display: 'block'}}>
              {this.state.errorMessage}
            </div>
          ):null}
        </div>
      </div>
    );
  }
}

export default Signup;
