import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Senha simples definida diretamente no código para o projeto
    if (senha === 'admin123') {
      localStorage.setItem('adminLogado', 'true');
      navigate('/admin-painel');
    } else {
      alert('Acesso negado! Senha incorreta.');
      setSenha('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 style={{ color: 'var(--cor-secundaria)', marginBottom: '1.5rem', textAlign: 'center' }}>Acesso Restrito</h2>
      
      <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)', borderTop: '5px solid var(--cor-secundaria)' }}>
        <p style={{ color: 'var(--cor-texto-claro)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Área exclusiva para a gestão da plataforma Ajuda Lá.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Palavra-passe de Gestão</label>
          <input 
            type="password" 
            required 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="Digite a senha..."
          />
        </div>
        <button type="submit" className="btn-primario" style={{ backgroundColor: 'var(--cor-secundaria)' }}>Entrar no Painel</button>
      </form>
    </div>
  );
}