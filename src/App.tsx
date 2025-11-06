import './App.css';
import Users from './Users/Users';
import Login from './Login/Login';
import Promocoes from './Promocoes/promocoes';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/promoções" element={<Promocoes />} />
      <Route path="/usuarios" element={<Users />} />
    </Routes>
  );
}

export default App;
