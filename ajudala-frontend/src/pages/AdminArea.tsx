import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Adicionar este import
import { api } from '../api';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export default function AdminArea() {
  const navigate = useNavigate(); // <-- Inicializar o navigate
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    // PROTEÇÃO: Se não estiver logado, expulsa para a tela de login
    if (localStorage.getItem('adminLogado') !== 'true') {
      navigate('/admin');
      return;
    }
    carregarCategorias();
  }, [navigate]);

  const carregarCategorias = async () => {
    // ... código que já existe ...
    try {
      const resposta = await api.get('/categorias');
      setCategorias(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar categorias.", erro);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    // ... código que já existe ...
    e.preventDefault();
    try {
      await api.post('/categorias', { nome, descricao });
      setNome('');
      setDescricao('');
      carregarCategorias();
    } catch (erro) {
      console.error("Erro ao salvar", erro);
      alert("Erro ao salvar a categoria!");
    }
  };

  // Função nova para o Admin sair
  const handleLogout = () => {
    localStorage.removeItem('adminLogado');
    navigate('/');
  };
  return (
    <div>
      {/* Cabeçalho atualizado com botão de Sair */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--cor-secundaria)' }}>Gerenciar Categorias</h2>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair
        </button>
      </div>
      
      {/* Formulário de Cadastro */}
      <form onSubmit={handleSalvar} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome da Categoria</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="Ex: Encanador, Eletricista..."
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Descrição</label>
          <input 
            type="text" 
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="Descreva o que este profissional faz..."
          />
        </div>

        <button type="submit" className="btn-primario">Salvar Categoria</button>
      </form>

      {/* Lista de Categorias Cadastradas */}
      <h3 style={{ color: 'var(--cor-secundaria)', marginBottom: '1rem' }}>Categorias Cadastradas</h3>
      
      {categorias.length === 0 ? (
        <p style={{ color: 'var(--cor-texto-claro)' }}>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {categorias.map(cat => (
            <div key={cat.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)', borderLeft: '4px solid var(--cor-primaria)' }}>
              <h4 style={{ color: 'var(--cor-secundaria)' }}>{cat.nome}</h4>
              <p style={{ color: 'var(--cor-texto-claro)', marginTop: '0.5rem' }}>{cat.descricao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}