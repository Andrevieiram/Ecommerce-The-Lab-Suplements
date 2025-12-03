import { useNavigate, NavLink } from 'react-router-dom';
import './Promocoes.css';
import ModalPromocao from './ModalPromocao';
import { useState, useEffect } from 'react';
import { API_BASE } from '../api';
import type { Promocao } from './types/index';


const Promocoes = () => {
  const navigate = useNavigate();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPromocoes = async () => {
    try {
      const res = await fetch(`${API_BASE}/promotion/getall`);
      const data = await res.json();
      setPromocoes(data.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar promoções');
    }
  };

  const handleDelete = async (_id: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta promoção?")) return;

    try {
      const res = await fetch(`${API_BASE}/promotion/delete/${_id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message);
      setPromocoes(prev => prev.filter(p => p._id !== _id));
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar a promoção');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const abrirModal = () => setIsModalOpen(true);
  const fecharModal = () => setIsModalOpen(false);

  const handlePromocaoAdded = (newPromocao: Promocao) => {
    setPromocoes(prev => [...prev, newPromocao]);
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchPromocoes();
  }, [navigate]);

  return (
    <div className="promocoes-container">
      <header className="header-container">
        <button className="avatar">
          <img id='picture' src='images/avatar.png' alt="Avatar" />
        </button>
      </header>

      <nav className="leftNav-container">
        <img
          className="logo-left"
          src="images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png"
          alt="The Lab Suplements"
        />
        <div className="nav-items">
          <NavLink to="/produtos" className={() => "nav-item"}>Produtos</NavLink>
          <NavLink to="/promocoes" className={() => "nav-item-active"}>Promoções</NavLink>
          <NavLink to="/usuarios" className={() => "nav-item"}>Usuários</NavLink>
        </div>
        <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-promocoes">
        <div className="main-title">
          <h1>Gerenciamento de Promoções</h1>
          <button className="promocaoAdd-button" onClick={abrirModal}>
            Adicionar Nova Promoção
          </button>
        </div>

        <div className="promocoes-table-container">
          <table className="promocoes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Unidade</th>
                <th>Preço</th>
                <th>Desconto</th>
                <th>Novo Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {promocoes.length > 0 ? (
                promocoes.map((p: Promocao) => (
                  <tr key={p._id}>
                    <td>{p._id}</td>
                    <td>{p.productId}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>
                    <td>{p.unit}</td>
                    <td>{p.price}</td>
                    <td>{p.discount || '-'}</td>
                    <td>{p.newPrice || '-'}</td>
                    <td>{p.status}</td>
                    <td>
                      <button
                        className="table-action-button-remove"
                        onClick={() => handleDelete(p._id!)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="table-empty">
                    Nenhuma promoção cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <ModalPromocao
        isOpen={isModalOpen}
        onClose={fecharModal}
        onPromocaoAdded={handlePromocaoAdded}

      />
    </div>
  );
};

export default Promocoes;
