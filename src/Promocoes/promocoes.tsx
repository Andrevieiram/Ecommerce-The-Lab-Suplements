import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './promocoes.css';
import ModalPromocao, { type Promotion } from './ModalPromocao';

const Promocoes = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  
  const fetchPromotions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    try {
        const response = await fetch('http://localhost:3000/api/promotion', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if(data.data) setPromotions(data.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);
  
  const handleDelete = async (code: string) => {
    if (!window.confirm("Excluir esta promoção?")) return;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/promotion/${code}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert("Promoção excluída!");
            setPromotions(promotions.filter(p => p.code !== code));
        } else {
            alert("Erro ao excluir.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  }
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className="promocoes-container">
      <header className="header-container">
        <div className="avatar"><img id='picture' src='images/avatar.png' alt="User" /></div>
      </header>
      
      <nav className="leftNav-container">
          <img className="logo-left" src="images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" alt="Logo" />
          <div className="nav-items">
            <NavLink to="/produtos" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Produtos</NavLink>
            <NavLink to="/promocoes" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Promoções</NavLink>
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Usuários</NavLink>
          </div>
          <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-promocoes">
        <div className="main-title">
            <h1>Gerenciamento de Promoções</h1>
            <button className="promocaoAdd-button" onClick={handleOpenCreate}>
                + Nova Promoção
            </button>
        </div>

        <div className="promocoes-table-container">
              {loading ? <p style={{padding: '20px'}}>Carregando...</p> : (
                  <table className="promocoes-table">
                      <thead>
                          <tr>
                            <th>Cód. Promo</th> 
                            <th>Produto (Alvo)</th> 
                            <th>Preço Original</th>
                            <th>Preço c/ Desc</th>
                            <th>Desconto</th>
                            <th>Ações</th>
                          </tr>
                      </thead>
                      <tbody>
                          {promotions.length > 0 ? (
                              promotions.map((promo) => (
                                  <tr key={promo._id || promo.code}>
                                      <td>{promo.code}</td>
                                      <td>{promo.productName}</td>
                                      
                                      <td>R$ {Number(promo.originalPrice || 0).toFixed(2)}</td>
                                      <td style={{color: '#2ecc71', fontWeight: 'bold'}}>
                                          R$ {Number(promo.discountedPrice || 0).toFixed(2)}
                                      </td>
                                      
                                      <td>{promo.discountPercentage}%</td>
                                      <td>
                                          <button className="btn-edit" onClick={() => handleEdit(promo)}>Editar</button>
                                          <button className="table-action-button-remove" onClick={() => handleDelete(promo.code)}>Excluir</button>
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr><td colSpan={6} className="table-empty">Nenhuma promoção cadastrada.</td></tr>
                          )}
                      </tbody>
                  </table>
              )}
        </div>
      </main>
      
      <ModalPromocao 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          promoToEdit={editingPromo}
          onSuccess={fetchPromotions} 
      />
    </div>
  );
};

export default Promocoes;