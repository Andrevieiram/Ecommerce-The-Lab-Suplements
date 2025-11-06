import './Login.css';

const Login = () => {
  return (
    <div id="background-container">
      <div className = "logo-left-login"><img src='images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png'></img></div>

      <div id="login-container">
      
        <h2>Sign in</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">User</label>
            <input type="text" id="username" placeholder="Enter User" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter Password" />
          </div>

          <button type="submit">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
