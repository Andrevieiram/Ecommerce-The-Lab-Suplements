import './App.css';
import Home from './Home/Home';
import Users from './Users/Users';
import Login from './Login/Login';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/produtos" element={<Home />} />
      <Route path="/usuarios" element={<Users />} /> 
    </Routes>
  );
}

export default App