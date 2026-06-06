import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';

// Importando as páginas que acabamos de criar
import Home from './pages/Home';
import AdminArea from './pages/AdminArea';
import PrestadorArea from './pages/PrestadorArea';
import ContratanteArea from './pages/ContratanteArea';
import Cadastro from './pages/Cadastro';
import LoginPrestador from './pages/LoginPrestador';
import LoginContratante from './pages/LoginContratante';
import LoginAdmin from './pages/LoginAdmin';
function App() {
  return (
    <BrowserRouter>
      {/* Navbar global */}
      <nav style={{ backgroundColor: 'var(--cor-secundaria)', padding: '1rem', color: 'white', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          AJUDA <span style={{ color: 'var(--cor-primaria)' }}>LÁ</span>
        </Link> {/* <-- Tag corrigida! */}
      </nav>

      {/* Roteador das páginas */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<LoginAdmin />} />
          <Route path="/admin-painel" element={<AdminArea />} />
          <Route path="/prestador" element={<LoginPrestador />} />
          <Route path="/prestador-agenda" element={<PrestadorArea />} />
          <Route path="/contratante" element={<LoginContratante />} /> {/* <-- Login do Cliente */}
          <Route path="/contratante-painel" element={<ContratanteArea />} /> 
          <Route path="/cadastro" element={<Cadastro />} />
          
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;