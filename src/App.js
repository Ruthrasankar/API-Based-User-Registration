import React, { useState } from "react";
import axios from "axios";
import './App.css';


function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const registerUser = async() => {
    console.log("hi")
    const res = await axios
      .post("http://localhost:5000/register", { name, password,email })
      .then(() => {
        console.log("hi")
        setError(null);
        setName("");
        // setPassword("");
        // setEmail("")
        alert("User registered successfully");
      })    

      .catch((error) => {
        setError(error.response.data.message);
      });

    const data = await res.data;
    return data;
    //console.log(data);
  };

  const authenticateUser = () => {
    axios
      .post("http://localhost:5000/user/authenticate", { apiKey })
      .then((response) => {
        setError(null);
        setUserData(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="App">
      <h1>User Registration with API Key Authentication</h1>
      <form onSubmit={registerUser}>
      <h2>Registration</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="nameField" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="passwordField" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="emailField" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button>Register</button>
      </form>
      <h2>Authentication</h2>
      <div>
        <label>API Key:</label>
        <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </div>
      <button onClick={authenticateUser}>Authenticate</button>

      <h2>User Details</h2>
      {userData && (
        <div>
          <p>Name: {userData.name}</p>
          {/* <p>Password : {userData.password} </p> */}
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;


