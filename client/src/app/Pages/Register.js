import "./Register.css";

import React, { useState } from 'react';


function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
    alert('Vous êtes déjà connecté.');
    window.location.href = '/profile';
  }

  const confirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    if (confirmPassword !== password) {
      document.querySelector('.register_confirm').style.display = 'block';
      document.querySelector('.register_button').disabled = true;
    } else {
      document.querySelector('.register_confirm').style.display = 'none';
      document.querySelector('.register_button').disabled = false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:3001/signup/';
      console.log(JSON.stringify({ email, password, pseudo: username }));
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, pseudo: username })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const userId = data.userId;
      localStorage.setItem('userId', userId);
      window.location.href = '/profile';

    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="register_container">
      <img src="https://images.unsplash.com/photo-1557683316-973673baf926" alt="register background" className="register_background" />
      <div className="register_main">
        <text className="register_title">Register</text>
        <text className="register_login">You already have an account? <a href="/login">Login</a></text>
        <form className="register_form" onSubmit={handleSubmit}>
          <div className="input">
            <label className="register_label">Username</label>
            <input type="text" className="register_input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input">
            <label className="register_label">Email</label>
            <input type="email" className="register_input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <label className="register_label">Password</label>
            <input type="password" className="register_input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="input">
            <label className="register_label">Confirm password</label>
            <input type="password" className="register_input" onChange={confirmPasswordChange} />
            <text className="register_confirm">Passwords must match</text>
          </div>

          <button className="register_button" disabled={true} onClick={handleSubmit}>Register</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
