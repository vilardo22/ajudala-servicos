import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function LoginContratante() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await api.get(`/usuarios/login/${email}`);
      const usuario = resposta.data;

      // Garante que um prestador não entra por engano na área do cliente
      if (usuario.tipoPerfil !== 'Contratante') {
        alert('Este e-mail não está cadastrado como Cliente/Contratante!');
        return;
      }

      // Guarda os dados do cliente na sessão do navegador
      localStorage.setItem('contratanteId', usuario.id.toString());
      localStorage.setItem('contratanteNome', usuario.nome);
      
      // Redireciona para o painel de busca de serviços
      navigate('/contratante-painel');
    } catch (erro) {
      alert('E-mail não encontrado! Verifique a digitação ou crie uma conta.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 style={{ color: 'var(--cor-secundaria)', marginBottom: '1.5rem', textAlign: 'center' }}>Acesso do Cliente</h2>
      
      <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Digite seu E-mail</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <button type="submit" className="btn-primario">Entrar e Buscar Serviços</button>
      </form>
    </div>
  );
}