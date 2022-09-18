import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = ['http://localhost:3000'];
    const token = localStorage.getItem("token");
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  // login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPwd, setRegisterPwd] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

  // auth status
  const [authObject, setAuthObject] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault()
    axios.post('http://localhost:3000/user/register', {
      email: registerEmail,
      password: registerPwd,
      username: registerUsername
    }).then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      window.location.reload()
    })
    .catch((err) => {
      console.log("ERR", err);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:3000/user/login", {
        email: loginEmail,
        password: loginPwd,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        window.location.reload()
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const getMe = async () => {
    axios.get('http://localhost:3000/user/getcurrent')
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  const handleLogOut = async () => {
    localStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    setAuthObject(JSON.parse(localStorage.getItem('user')) || null) 
  }, [])

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={handleRegister} className="form">
          <h1>Register</h1>
          <label>Username </label>
          <input
            type="text"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <label>Email </label>
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <label>Password </label>
          <input
            type="password"
            value={registerPwd}
            onChange={(e) => setRegisterPwd(e.target.value)}
          />
          <br /> <br />
          <button type="submit">Register</button> 
        </form>
        <div>
        {authObject ? (
          <div>{authObject.username} {authObject.email} {authObject._id} </div>
        ) : (
          <>Not Authenticated</>
        )}
        <br />
        <button onClick={() => getMe()}>Am I authenticated?</button>
        <br />
        <br />
        <button onClick={() => handleLogOut()}>Logout</button>
        </div>

        <form onSubmit={handleLogin} className="form">
          <h1>Login</h1>
          <label>Email </label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <label>Password </label>
          <input
            type="password"
            value={loginPwd}
            onChange={(e) => setLoginPwd(e.target.value)}
          />
          <br /> <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default App;
