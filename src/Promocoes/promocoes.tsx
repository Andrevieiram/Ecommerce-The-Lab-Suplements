import { useNavigate, NavLink } from 'react-router-dom';
import './Promocoes.css';
import { getPromocoes, savePromocoes } from './StoragePromocoes.tsx'; 
import ModalPromocao from './ModalPromocao.tsx'; 
import { useState, useEffect } from 'react';


interface Promocao {
  id: string;
  name: string;
  category: string;
  stock: string;
  unit: string;
  price: string;
  discount?: string;
  newPrice?: string;
  status: 'Ativa' | 'Inativa';
}

const Promocoes = () => {
  const navigate = useNavigate();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const loadPromocoes = () => {
    const storedPromocoes = getPromocoes<Promocao[]>('promocoes') || []; 
    setPromocoes(storedPromocoes);
  };
  
  const handleDelete = (idToDelete: string) => {
  setPromocoes((prevPromocoes: Promocao[]) => {
    return prevPromocoes.map((p: Promocao) =>
      p.id === idToDelete
        ? { ...p, discount: '', newPrice: '', status: 'Inativa' }
        : p
    );
  });
};

  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  
  const abrirModal = () => setIsModalOpen(true);
  const fecharModal = () => setIsModalOpen(false);


  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
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
          <NavLink to="/promocoes" className={() => "nav-item-active"}>Promoções</NavLink>
          <NavLink to="/produtos" className={() => "nav-item"}>Produtos</NavLink>
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
                  <tr key={p.id}>
                    <td>{p.id}</td>
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
                        onClick={() => handleDelete(p.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="table-empty">
                    Nenhum produto encontrado.
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
