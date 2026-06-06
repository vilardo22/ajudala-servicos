import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {/* Logo e Slogan baseados na identidade visual */}
      <h1 style={{ color: 'var(--cor-secundaria)', fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '900' }}>
        AJUDA <span style={{ color: 'var(--cor-primaria)' }}>LÁ</span>
      </h1>
      <h3 style={{ color: 'var(--cor-texto-claro)', fontWeight: 'normal', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Ajudando quem precisa, conectando quem sabe
      </h3>

      {/* Cartão Central de Navegação */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.2rem', 
        maxWidth: '400px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '3rem 2rem',
        borderRadius: 'var(--borda-arredondada)',
        boxShadow: 'var(--sombra-leve)'
      }}>
        <p style={{ fontWeight: 'bold', color: 'var(--cor-secundaria)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Qual é o seu perfil?
        </p>
        
        <Link to="/contratante" style={{ textDecoration: 'none' }}>
          <button className="btn-primario" style={{ fontSize: '1.1rem', padding: '1rem', boxShadow: '0 4px 6px rgba(255, 118, 34, 0.2)' }}>
            Preciso de Ajuda
          </button>
        </Link>
        
        <Link to="/prestador" style={{ textDecoration: 'none' }}>
          <button className="btn-primario" style={{ backgroundColor: 'var(--cor-secundaria)', fontSize: '1.1rem', padding: '1rem' }}>
            Sou Prestador
          </button>
        </Link>

        <hr style={{ border: 'none', borderTop: '1px solid var(--cor-borda)', margin: '1rem 0' }} />

        <Link to="/cadastro" style={{ textDecoration: 'none' }}>
          <button className="btn-primario" style={{ backgroundColor: 'transparent', color: 'var(--cor-primaria)', border: '2px solid var(--cor-primaria)' }}>
            Criar Conta
          </button>
        </Link>

        {/* Link discreto para o professor conseguir avaliar o CRUD de categorias */}
        <Link to="/admin" style={{ marginTop: '1.5rem', color: 'var(--cor-texto-claro)', fontSize: '0.9rem', textDecoration: 'underline' }}>
          Acesso Restrito (Administrador)
        </Link>
      </div>
    </div>
  );
}