import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import ModalProduto, { type newProduct } from './ModalProduto.tsx';

const Produtos = () => {
  
  const navigate = useNavigate(); 
  
  const getToken = () => localStorage.getItem('token');
  
  const [products, setProducts] = useState<newProduct[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsLoading] = useState(false);

  interface Product {
    _id?: string;
    code: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: boolean;
  }
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const token = getToken();

    if (!token) {
        console.error("Token de autenticação ausente.");
        setIsLoading(false);
        navigate('/'); 
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Credenciais inválidas.');
            return;
        }

        const fetchedProducts: Product[] = (data.data || []).map((p: any) => ({
            _id: p._id, 
            code: String(p.code),
            name: String(p.name),
            category: String(p.category),
            price: parseFloat(p.price),
            stock: parseInt(p.stock),
            status: p.status === true ? 'Ativo' : 'Inativo',
        }));
        setProducts(fetchedProducts); 
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const handleDelete = async (codeToDelete: string) => {
    if (!window.confirm("Confirmar remoção do produto?")) return;
    
    setIsLoading(true);
    const token = getToken();

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${codeToDelete}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha na remoção do backend.');
        }

        setProducts(prev => prev.filter(product => product.code !== codeToDelete));
        
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProductAdded = async (newProduct: newProduct) => {
    setIsLoading(true);
    const token = getToken();

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newProduct)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao adicionar produto.');
        }

        await fetchProducts(); 
        
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto ");
    } finally {
        setIsLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  

  const abrirModal = () => setIsModalOpen(true);
  
  const fecharModal = () => {
    setIsModalOpen(false);
  }

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
            <button className="productAdd-button" onClick={abrirModal}>
                Adicionar Novo Produto
            </button>
        </div>

        <div className="products-table-container">
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
                    className="table-action-button-remove" 
                    onClick={() => handleDelete(product.code)}
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
  );
};

export default Produtos;

