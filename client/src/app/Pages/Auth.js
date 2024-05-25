import "./Auth.css";

import React, { useState, useEffect } from 'react';

import registerImg from '../../res/icon/left-arrow.png';
import loginImg from '../../res/icon/right-arrow.png';


function Auth() {
  const background = "https://images.unsplash.com/photo-1557683316-973673baf926"
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [register, setRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:3001/auth/' + (register ? 'signup/' : 'login/');
      const body = register ? { email, password, pseudo: username } : { email, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const userId = data.userId;
      const token = data.token;
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('userId', userId);
      storage.setItem('token', token);

      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage(register ? 'Erreur lors de l\'inscription.' : 'Identifiants incorrects. Veuillez réessayer.');
    }
  };

  function handleAuth() {
    setRegister(!register);
    if (register) {
      // Move auth_main to the right (left: from 0 to 50%)
      for (let i = 0; i <= 50; i++) {
        setTimeout(() => {
          document.querySelector('.auth_main').style.left = `${i}%`;
        }, i * 3);
      }
    } else {
      // Move auth_main to the left (left: from 50% to 0)
      for (let i = 50; i >= 0; i--) {
        setTimeout(() => {
          console.log(i);
          document.querySelector('.auth_main').style.left = `${i}%`;
        }, (50 - i) * 3);
      }
    }
  }

  const confirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    if (confirmPassword !== password) {
      document.querySelector('.confirm').style.display = 'block';
      document.querySelector('.button').disabled = true;
    } else {
      document.querySelector('.confirm').style.display = 'none';
      document.querySelector('.button').disabled = false;
    }
  };

  return (
    <div className="login_container">
      <button className="back_button" onClick={() => window.history.back()} >{"< BACK"}</button>
      <div alt="login background" className="login_background" style={{ backgroundImage: `url(${background})` }} />
      
      <div className="go_register_button" onClick={handleAuth}>
        <img src={registerImg} alt="back" className="go_register_icon" />
        <text className="go_register_label" >REGISTER</text>
      </div>

      <div className="go_login_button" onClick={handleAuth}>
        <text className="go_login_label" >LOGIN</text>
        <img src={loginImg} alt="next" className="go_login_icon" />
      </div>

      <div className="auth_main">
        {!register &&
        <div className="login_cont">
          <text className="title">Login</text>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input">
              <label className="label">Email</label>
              <input type="email" className="text_input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input">
              <label className="label">Password</label>
              <input type="password" className="text_input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="remember">
              <input type="checkbox" className="login_checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <label className="login_checkbox_label" onClick={() => setRememberMe(!rememberMe)} style={{ cursor: 'pointer' }}>Remember me</label>
            </div>
            <button className="button">Login</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        }
        {register &&
        <div className="register_cont">
          <text className="title">Register</text>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input">
              <label className="label">Username</label>
              <input type="text" className="text_input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input">
              <label className="label">Email</label>
              <input type="email" className="text_input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input">
              <label className="label">Password</label>
              <input type="password" className="text_input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input">
              <label className="label">Confirm password</label>
              <input type="password" className="text_input" onChange={confirmPasswordChange} />
              <text className="confirm">Passwords must match</text>
            </div>
            <button className="button" disabled={true}>Register</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        }
      </div>
    </div>
  );
}

export default Auth;
