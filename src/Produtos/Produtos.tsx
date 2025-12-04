import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import ModalProduto from './ModalProduto.tsx';

const Produtos = () => {
  
  const navigate = useNavigate(); 
  
  const getToken = () => localStorage.getItem('token');

  interface Product {
    _id?: string;
    code: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: boolean;
  }

  const [products, setProducts] = useState<Product[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const fetchProducts= useCallback (async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if(data.data) setProducts(data.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [navigate, fetchProducts]);
  
  const handleDelete = async (codeToDelete: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esse produto?")) return;
    
    const token = getToken();

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${codeToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Produto excluído com sucesso!");
            setProducts(products.filter(product => product.code !== codeToDelete));
        } else {
            alert("Erro ao excluir produto");
        }
    } catch (error) {
        alert("Erro de conexão:" + error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  }
  
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token'); 
    navigate('/'); 
  };


  useEffect(() => {
    const token = getToken(); 
    if (!token) {
        navigate('/'); 
        return; 
    }
    fetchProducts();
  }, [navigate, fetchProducts]);

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
            <NavLink to="/produtos" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Produtos</NavLink>
            <NavLink to="/promocoes" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Promoções</NavLink>
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Usuários</NavLink>
          </div>


          <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-products">
        <div className="main-title">
            <h1>Gerenciamento de Produtos</h1>
            <button className="productAdd-button" onClick={handleOpenCreate}>
                Adicionar Novo Produto
            </button>
        </div>

        <div className="products-table-container">
              {loading ? (
                  <p style={{padding: '20px'}}>Carregando...</p>
              ) : (
                  <table className="products-table">
                      <thead>
                          <tr>
                            <th>Code</th> 
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
                              products.map((product) => (
                                  <tr key={product._id}>
                                      <td>{product.code}</td>
                                      <td>{product.name}</td>
                                      <td>{product.category}</td>
                                      <td>{product.stock}</td>
                                      <td>{product.price}</td>
                                      <td>{product.status === true ? "Ativo" : "Inativo"}</td>
                                      <td>
                                          <button 
                                              className="btn-edit"
                                              onClick={() => handleEdit(product)}
                                          >
                                              Editar
                                          </button>
                                          <button
                                              className="table-action-button-remove" 
                                              onClick={() => handleDelete(product.code)}
                                          >
                                              Excluir
                                          </button>
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan={7} className="table-empty">Nenhum produto encontrado.</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              )}
        </div>
      </main>
      
      <ModalProduto 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          productToEdit={editingProduct}
          onSuccess={fetchProducts} 
      />
    </div>
  );
};

export default Produtos;

