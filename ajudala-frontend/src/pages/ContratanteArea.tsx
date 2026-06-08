import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

interface Prestador {
  id: number;
  nome: string;
  whatsApp: string;
}

export default function ContratanteArea() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  
  // Estado para a data e hora do agendamento
  const [dataHora, setDataHora] = useState('');

  // Captura os dados do cliente logado
  const contratanteId = localStorage.getItem('contratanteId');
  const contratanteNome = localStorage.getItem('contratanteNome');

  useEffect(() => {
    if (!contratanteId) {
      navigate('/contratante');
      return;
    }
    carregarCategorias();
  }, [contratanteId, navigate]);

  const carregarCategorias = async () => {
    try {
      const resposta = await api.get('/categorias');
      setCategorias(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar categorias", erro);
    }
  };

  const selecionarCategoria = async (cat: Categoria) => {
    setCategoriaSelecionada(cat);
    try {
      const resposta = await api.get(`/prestadores/categoria/${cat.id}`);
      setPrestadores(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar prestadores", erro);
    }
  };

  // Função crucial: Grava o agendamento na API e depois abre o WhatsApp
  const handleSolicitarServico = async (prestador: Prestador) => {
    if (!dataHora) {
      alert('Por favor, selecione a data e o horário do serviço!');
      return;
    }

    const novoAgendamento = {
      dataHora: new Date(dataHora).toISOString(),
      prestadorId: prestador.id,
      contratanteId: Number(contratanteId)
    };

    try {
      // 1. Tenta gravar no SQLite através da API C#
      await api.post('/agendamentos', novoAgendamento);
      
      // 2. Só executa os passos abaixo se o C# disser "OK" e salvar no banco
      const numeroLimpo = prestador.whatsApp.replace(/\D/g, '');
      const texto = `Olá ${prestador.nome}, meu nome é ${contratanteNome}. Solicitei um serviço de ${categoriaSelecionada?.nome} pelo Ajuda Lá para o dia ${new Date(dataHora).toLocaleString('pt-BR')}!`;
      
      window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(texto)}`, '_blank');
      alert('Agendamento registrado! Entre em contato com o profissional.');
      
    } catch (erro: any) {
      // Se o C# devolver o erro 400 que acabamos de criar, pegamos a mensagem exata
      if (erro.response && erro.response.status === 400) {
        alert(erro.response.data.mensagem);
      } else {
        console.error("Erro ao processar agendamento", erro);
        alert('Erro ao registrar o agendamento no sistema. Tente novamente.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--cor-secundaria)' }}>Olá, {contratanteNome}</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sair
        </button>
      </div>

      <p style={{ marginBottom: '2rem', color: 'var(--cor-texto-claro)' }}>Selecione o tipo de profissional de que necessita:</p>

      {/* Grid de Categorias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {categorias.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => selecionarCategoria(cat)}
            style={{ 
              backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--borda-arredondada)', 
              border: categoriaSelecionada?.id === cat.id ? '2px solid var(--cor-primaria)' : '1px solid var(--cor-borda)',
              cursor: 'pointer'
            }}
          >
            <h3 style={{ color: 'var(--cor-secundaria)' }}>{cat.nome}</h3>
          </div>
        ))}
      </div>

      {/* Escolha de Data/Hora e Lista de Prestadores */}
      {categoriaSelecionada && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--borda-arredondada)', marginBottom: '2rem', boxShadow: 'var(--sombra-leve)' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--cor-secundaria)' }}>Agendar para quando?</label>
            <input 
              type="datetime-local" 
              value={dataHora} 
              onChange={(e) => setDataHora(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--cor-borda)' }}
            />
          </div>

          <h3 style={{ color: 'var(--cor-secundaria)', marginBottom: '1rem' }}>Profissionais Disponíveis:</h3>
          
          {prestadores.length === 0 ? (
            <p style={{ color: 'var(--cor-texto-claro)' }}>Nenhum profissional cadastrado nesta categoria.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {prestadores.map(prestador => (
                <div key={prestador.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--borda-arredondada)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--sombra-leve)' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--cor-secundaria)' }}>{prestador.nome}</span>
                  
                  <button 
                    onClick={() => handleSolicitarServico(prestador)}
                    className="btn-primaria" 
                    style={{ backgroundColor: '#25D366', width: 'auto', borderRadius: 'var(--borda-arredondada)',fontWeight: 'bold', color:'white'}}
                  >
                    Agendar e Chamar no WhatsApp
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}