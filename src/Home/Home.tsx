import { useNavigate } from 'react-router-dom'; 
import './Home.css';


const Home = () => {

  const navigate = useNavigate(); 

  

  const goToUsers = () => {
    navigate('/usuarios'); 
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
            <button className="nav-item">Promoções</button>
            <button className="nav-item-active">Produtos</button>
            <button className="nav-item" onClick={goToUsers}>Usuários</button>
          </div>

          <button className="nav-item-logout">Logout</button>
      </nav>

      <main className="main-products">
        <div className="main-title">
            <h1>Gerenciamento de Produtos</h1>
            <button className="productAdd-button">Adicionar Novo Produto</button>
          
        </div>

        <div id="products-table-container">
          <table id='lista-produtos'>
              <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Preço</th>
              <th>Status</th>
              </tr>
              <tr>
                <td>Whey Protein Isolado 1kg</td>	
                <td>Suplementos</td>	
                <td>150 un.</td>	
                <td>R$ 129.90</td>	
                <td>Ativo</td>
              </tr>
            </table>
                      
        </div>
            
                    
        
      </main>

      
      
    </div>
  )
}

export default Home




