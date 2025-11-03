import { Link } from 'react-router-dom';

import './Home.css';
const Home = () => {
  return (
    <div id="home-container">
        <header id="header">
            <button id="brand">
                <img id="logo" src="images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png"></img>
            </button>
            <button id="avatar">
                <img id='picture' src='images\avatar.png'></img>
            </button>
        </header>
        <main>
          <div id='left-container'>
            <div id='titulo'>
              <p>FitSupply Admin</p>
            </div>
            <Link to="/produtos"> 
              <button>
                <span>Produtos</span>
              </button>
            </Link>
            <button>
              <span>Promoções</span>
            </button>
            <button>
              <span>Usuários</span>
            </button>
          </div>

          <div className='grid-produtos'>
            <div className='topo'>
              <div className='botao-titulo'>
                <h2>Gerenciamento de produtos</h2>
                <button>
                  <span>Adicionar produto</span>
                </button>
              </div>
              <input type='text' placeholder='Buscar produto...' className='search'></input>
            </div>

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




