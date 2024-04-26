import "./Login.css";

import React, { useState, useEffect } from 'react';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      window.location.href = '/profile';
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId'); // Assurez-vous de nettoyer les données
    }
  }, []);

  function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:3001/login/';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const token = data.token;
      const userId = data.userId;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('userId', userId);

      window.location.href = '/profile';

    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="login_container">
      <img src="https://images.unsplash.com/photo-1557683316-973673baf926" alt="login background" className="login_background" />
      <div className="login_main">
        <text className="login_title">Login</text>
        <text className="login_register">You don't have an account? <a href="/register">Register</a></text>
        <form className="login_form" onSubmit={handleSubmit}>
          <div className="input">
            <label className="login_label">Email</label>
            <input type="email" className="login_input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <label className="login_label">Password</label>
            <input type="password" className="login_input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="remember">
            <input type="checkbox" className="login_checkbox" />
            <label className="login_checkbox_label" onClick={() => setRememberMe(!rememberMe)}>Remember me</label>
          </div>
          <button className="login_button">Login</button>
        </form>
        <text className="login_forgot">Forgot your password?<a href="/forgot">Click here</a></text>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
