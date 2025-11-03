import "./Users.css";

const Users = () => {
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
            <button className="nav-item">Dashboard</button>
            <button className="nav-item">Produtos</button>
            <button className="nav-item-active">Usuários</button>
          </div>

          <button className="nav-item-logout">Logout</button>
      </nav>

      <main className="main-users">
        <div className="main-title">
            <h1>Gerenciamento de Usuários</h1>
            <button className="userAdd-button">Adicionar Novo Usuários</button>
          
        </div>

        <div className="users-table-container">

                      
        </div>
            
                    
        
      </main>

      
      
    </div>
  )
}

export default Users