import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import ModalProduto from './ModalProduto';
import api from '../../api'; // Certifique-se que o caminho para o seu api.ts está correto
import './Produtos.css';

interface Product {
  _id?: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: boolean;
}

const Produtos = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Busca produtos usando a nossa instância do Axios
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/produtos');
      // O Axios já trata o JSON, acessamos direto response.data
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      console.error("Erro ao carregar produtos:", error);
      if (err.response?.status === 401) {
        navigate('/'); // Se o token expirou, desloga
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Efeito único para autenticação e carga inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [navigate, fetchProducts]);

  const handleDelete = async (idOrCode: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esse produto?")) return;

    try {
      // DICA: Se o seu backend usa o ID do MongoDB, use o ID aqui. 
      // Se usa o código manual, mantenha o codeToDelete.
      await api.delete(`/produtos/${idOrCode}`);
      
      alert("Produto excluído com sucesso!");
      // Atualiza a lista local removendo o item
      setProducts(prev => prev.filter(p => p._id !== idOrCode && p.code !== idOrCode));
    } catch (error) {
      alert("Erro ao excluir produto.");
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="products-container">
      <header className="header-container">
        <button className="avatar">
          <img id="picture" src="/images/avatar.png" alt="User Avatar" />
        </button>
      </header>

      <nav className="leftNav-container">
        <img 
          className="logo-left" 
          src="/images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" 
          alt="The Lab Suplements" 
        />

        <div className="nav-items">
          <NavLink to="/produtos" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
            Produtos
          </NavLink>
          <NavLink to="/promocoes" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
            Promoções
          </NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>
            Usuários
          </NavLink>
        </div>

        <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-products">
        <div className="main-title">
          <h1>Gerenciamento de Produtos</h1>
          <button className="productAdd-button" onClick={handleOpenCreate}>
            + Adicionar Produto
          </button>
        </div>

        <div className="products-table-container">
          {loading ? (
            <div className="loading-area">Carregando produtos...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Código</th>
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
                    <tr key={product._id || product.code}>
                      <td>{product.code}</td>
                      <td className="bold">{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.stock}</td>
                      <td>R$ {product.price.toFixed(2)}</td>
                      <td>
                        <span className={product.status ? "status-ativo" : "status-inativo"}>
                          {product.status ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(product)}>
                          Editar
                        </button>
                        <button
                          className="table-action-button-remove"
                          onClick={() => handleDelete(product._id || product.code)}
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