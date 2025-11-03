import './App.css'
import Home from './Home/Home'
import Products from './Products/Products'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Products />} /> 
    </Routes>
  );
}

export default App