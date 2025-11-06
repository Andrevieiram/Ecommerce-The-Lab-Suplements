import { useNavigate } from 'react-router-dom'; 
import './promocoes.css';


const Home = () => {

  const navigate = useNavigate(); 

  

  const goToUsers = () => {
    navigate('/promocoes'); 
  };

  const goToProducts = () => {
    navigate('/produtos'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };



  return (
    <div className = "users-container">
      <header className="header-container">
        <button className="avatar">
                <img id='picture' src='images\avatar.png'></img>
        </button>
      </header>

      <nav className="leftNav-container">
          <img className="logo-left" src="images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" alt="The Lab Suplements" />
      
          <div className="nav-items">
            <button className="nav-item" onClick={goToProducts}>Produtos</button>
            <button className="nav-item-active">Promoções</button>
            <button className="nav-item" onClick={goToUsers}>Usuários</button>
          </div>

          <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-products">
        <div className="main-title">
            <h1>Gerenciamento de Produtos em Promoção</h1>
            <button className="productAdd-button">Adicionar Nova Promoção</button>
          
        </div>

        <div id="products-table-container">
          <table id='lista-produtos'>
            <thead>
              <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Novo Preço</th>
              <th>Promoção aplicada</th>
              <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Whey Protein Isolado 1kg</td>	
                <td>Suplementos</td>	
                <td>150 un.</td>	
                <td>R$ 103.92</td>	
                <td> 20% </td>
                <td>Ativo</td>
              </tr>
              <tr>
                <td>Creatina Pura 300g</td>	
                <td>Suplementos</td>	
                <td>150 un.</td>	
                <td>R$ 39.10</td>	
                <td> 15% </td>
                <td>Ativo</td>
              </tr>
            </tbody>
          </table>
                      
        </div>
            
                    
        
      </main>

      
      
    </div>
  )
}

export default Home




