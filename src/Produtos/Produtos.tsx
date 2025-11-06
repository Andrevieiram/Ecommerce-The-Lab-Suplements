import { useNavigate, NavLink } from 'react-router-dom'; 
import './Produtos.css';
import { getProducts, saveProducts } from './StorageProducts.tsx'; 
import ModalProduto from './ModalProduto.tsx'; 
import { useState, useEffect } from 'react';


interface Product {
  id: string; 
  name: string;
  category: string;
  price: string; 
  stock: string;
  status: 'Ativo' | 'Inativo';
}

const Produtos = () => {
  const navigate = useNavigate(); 
  
  
  const [products, setProducts] = useState<Product[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const loadProducts = () => {
    const storedProducts = getProducts<Product[]>('products') || []; 
    setProducts(storedProducts);
  };
  
  const handleDelete = (idToDelete: string) => {
    const updatedProducts = products.filter((product: { id: string; }) => product.id !== idToDelete);
    setProducts(updatedProducts);
    saveProducts('products', updatedProducts); 
  };
  
  const handleProductAdded = (newProduct: Product) => {
      setProducts(prev => [...prev, newProduct]);
  };


  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); 
    navigate('/'); 
  };

  const goToUsers = () => {
    navigate('/usuarios'); 
  };

  const abrirModal = () => setIsModalOpen(true);
  
  const fecharModal = () => {
      setIsModalOpen(false);
      loadProducts(); 
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        navigate('/');
        return; 
    }
    
    loadProducts();
  }, [navigate]);
  

  return (
    <div className = "products-container">
      <header className="header-container">
        <button className="avatar">
                <img id='picture' src='images\avatar.png'></img>
        </button>
      </header>
      
      <nav className="leftNav-container">
          <img className="logo-left" src="images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" alt="The Lab Suplements" />
      
          <div className="nav-items">
            <NavLink to="/produtos" className={() => "nav-item-active"}>Produtos</NavLink>
            <button className="nav-item">Promoções</button>
            <button className="nav-item" onClick={goToUsers}>Usuários</button>
          </div>

          <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-products">
        <div className="main-title">
            <h1>Gerenciamento de Produtos</h1>
            <button className="productAdd-button" onClick={abrirModal}>
                Adicionar Novo Produto
            </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th> 
                <th>Nome</th> 
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                products.map((product: Product) => (
                  <tr key={product.id}>
                  <td>{product.id}</td> 
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td> 
                  <td>{product.price}</td> 
                  <td>{product.status}</td> 
                  <td>
                    <button 
                    className="table-action-button-remove" 
                    onClick={(): void => handleDelete(product.id)}
                    >
                    Remover
                    </button>
                  </td>
                  </tr>
                ))
                ) : (
                <tr>
                  <td colSpan={7} className="table-empty">
                  Nenhum produto cadastrado.
                  </td>
                </tr>
                )}
            </tbody>
          </table>
        </div>
      </main>
      
      <ModalProduto 
          isOpen={isModalOpen} 
          onClose={fecharModal} 
          onProductAdded={handleProductAdded} 
      />
    </div>
  )
}

export default Produtos;

