import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

// Tipagem da Categoria
interface Categoria {
  id: number;
  nome: string;
}

export default function Cadastro() {
  const navigate = useNavigate();
  
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState('Contratante');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [whatsapp, setWhatsapp] = useState('');
  
  // Estado para armazenar as categorias vindas do banco
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Carrega as categorias assim que a tela abre
  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const resposta = await api.get('/categorias');
      setCategorias(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar categorias", erro);
    }
  };

  const handleSalvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Monta o objeto exatamente como o C# espera
    const novoUsuario = {
      nome,
      email,
      whatsapp,
      tipoPerfil,
      // Só envia a categoria se for prestador
      categoriaId: tipoPerfil === 'Prestador' && categoriaId !== '' ? Number(categoriaId) : null 
    };

    try {
      await api.post('/usuarios', novoUsuario);
      alert('Cadastro realizado com sucesso!');
      navigate('/'); // Volta para a tela inicial
    } catch (erro) {
      console.error("Erro ao salvar usuário", erro);
      alert('Erro ao realizar cadastro.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--cor-secundaria)', marginBottom: '1.5rem', textAlign: 'center' }}>Crie sua Conta</h2>
      
      <form onSubmit={handleSalvarUsuario} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)' }}>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome Completo</label>
          <input 
            type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="Seu nome"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>E-mail de Contato</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            placeholder="seu@email.com"
          />
        </div>
              <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>WhatsApp</label>
        <input 
          type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
          placeholder="Ex: 41999999999"
        />
            </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>O que você deseja fazer?</label>
          <select 
            value={tipoPerfil} onChange={(e) => setTipoPerfil(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
          >
            <option value="Contratante">Quero contratar serviços</option>
            <option value="Prestador">Quero prestar serviços</option>
          </select>
        </div>

        {/* Este bloco SÓ aparece se o usuário escolher "Prestador" */}
        {tipoPerfil === 'Prestador' && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--cor-fundo)', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--cor-primaria)' }}>Qual a sua especialidade?</label>
            <select 
              required value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn-primario" style={{ marginTop: '1rem' }}>Finalizar Cadastro</button>
      </form>
    </div>
  );
}