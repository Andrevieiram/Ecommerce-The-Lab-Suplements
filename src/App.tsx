import './App.css'
import Home from './Home/Home'
import Users from './Users/Users'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/produto" element={<Home />} />
      <Route path="/users" element={<Users />} /> 
    </Routes>
  );
}

export default App