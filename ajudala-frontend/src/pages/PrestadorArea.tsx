import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

interface Agendamento {
  id: number;
  dataHora: string;
  status: string;
  contratanteNome: string;
}

export default function PrestadorArea() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const navigate = useNavigate();
  
  const prestadorId = localStorage.getItem('prestadorId');
  const prestadorNome = localStorage.getItem('prestadorNome');

  useEffect(() => {
    if (!prestadorId) {
      navigate('/prestador');
      return;
    }
    carregarAgenda();
  }, [prestadorId, navigate]);

  const carregarAgenda = async () => {
    try {
      const resposta = await api.get(`/agendamentos/prestador/${prestadorId}`);
      setAgendamentos(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar a agenda", erro);
    }
  };

  // Função nova para atualizar o status no banco de dados C#
  const atualizarStatus = async (agendamentoId: number, novoStatus: string) => {
    try {
      await api.put(`/agendamentos/${agendamentoId}/status/${novoStatus}`);
      carregarAgenda(); // Recarrega a tela instantaneamente
    } catch (erro) {
      console.error("Erro ao atualizar status", erro);
      alert("Não foi possível atualizar o agendamento.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Formatação segura da data para evitar o "Invalid Date"
  const formatarData = (dataIso: string) => {
    if (!dataIso) return "Data a combinar";
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return "Data a combinar";
    return data.toLocaleString('pt-BR');
  };

  // Função para definir a cor da etiqueta de status
  const corDoStatus = (status: string) => {
    switch(status) {
      case 'Aceito': return { bg: '#d4edda', text: '#155724' }; // Verde
      case 'Recusado': return { bg: '#f8d7da', text: '#721c24' }; // Vermelho
      default: return { bg: '#FFF3ED', text: 'var(--cor-primaria)' }; // Laranja (Pendente)
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--cor-secundaria)' }}>Agenda de {prestadorNome}</h2>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair do Painel
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {agendamentos.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '2rem', textAlign: 'center', borderRadius: 'var(--borda-arredondada)', border: '1px dashed var(--cor-borda)' }}>
            <p style={{ color: 'var(--cor-texto-claro)' }}>Nenhum agendamento pendente no momento.</p>
          </div>
        ) : (
          /* O laço .map que cria cada cartão. O 'ag' só existe daqui para baixo! */
          agendamentos.map(ag => {
            const cores = corDoStatus(ag.status);
            
            return (
              <div key={ag.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--borda-arredondada)', boxShadow: 'var(--sombra-leve)', borderLeft: '5px solid var(--cor-primaria)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--cor-secundaria)' }}>Cliente: {ag.contratanteNome}</h3>
                  <span style={{ backgroundColor: cores.bg, color: cores.text, padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {ag.status}
                  </span>
                </div>
                
                <p style={{ color: 'var(--cor-texto)' }}><strong>Data e Hora:</strong> {formatarData(ag.dataHora)}</p>
                
                {/* Lógica dos Botões condicionada ao status */}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  {ag.status === 'Pendente' && (
                    <>
                      <button 
                        className="btn-primario" 
                        style={{ width: 'auto', backgroundColor: '#25D366' }}
                        onClick={() => atualizarStatus(ag.id, 'Aceito')}
                      >
                        Aceitar Serviço
                      </button>
                      <button 
                        className="btn-primario" 
                        style={{ width: 'auto', backgroundColor: '#dc3545', color: 'white' }}
                        onClick={() => atualizarStatus(ag.id, 'Recusado')}
                      >
                        Recusar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}