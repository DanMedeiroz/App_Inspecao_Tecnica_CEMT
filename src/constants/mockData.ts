// src/constants/mockData.ts
import { Inspecao, Obra, Pavimento } from "../types";

export const OBRAS_MOCK: Obra[] = [
  {
    id: "1",
    nome: "Edifício Comercial Santos",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    tecnico: "João Silva",
    empresaNome: "Construtora Santos",
    dataInicio: "2024-01-01",
    status: "ativa",
  },
  {
    id: "2",
    nome: "Residencial Jardim América",
    endereco: "Rua das Flores, 250 - São Paulo/SP",
    tecnico: "Maria Santos",
    empresaNome: "Jardim Empreendimentos",
    dataInicio: "2024-02-01",
    status: "ativa",
  },
  {
    id: "3",
    nome: "Shopping Center Norte",
    endereco: "Av. dos Estados, 5000 - Santo André/SP",
    tecnico: "Carlos Oliveira",
    empresaNome: "Norte Shopping",
    dataInicio: "2024-03-01",
    status: "ativa",
  },
];

// Simulando a contagem de documentos vencidos (Map: ObraID -> Quantidade)
export const DOCUMENTOS_VENCENDO_MOCK: Record<string, number> = {
  "1": 7,
  "2": 2,
  "3": 0,
};

export const INSPECOES_MOCK: Inspecao[] = [
  {
    id: "101",
    obraId: "1",
    // Data com hora específica para testarmos o display novo
    data: "2026-02-09T08:30:00.000Z", 
    tecnico: "Pedro Almeida",
    status: "em-andamento", // O campo existe no type, mantemos aqui mesmo que não mostre na tela
    observacoes: "Início da verificação estrutural",
  },
  {
    id: "102",
    obraId: "1",
    data: "2026-02-02T14:45:00.000Z",
    tecnico: "Ana Costa",
    status: "concluida",
  },
  {
    id: "201",
    obraId: "2",
    data: "2026-01-20T10:00:00.000Z",
    tecnico: "Maria Santos",
    status: "concluida",
  },
];

export const PAVIMENTOS_MOCK: Pavimento[] = [
  // Pavimentos da Inspeção 101 (Edifício Santos)
  {
    id: "301",
    inspecaoId: "101",
    nome: "Térreo / Hall de Entrada",
    ordem: 0,
    itensInspecionados: 0, // Campo obrigatório pelo seu type
  },
  {
    id: "302",
    inspecaoId: "101",
    nome: "1º Andar - Garagem",
    ordem: 1,
    itensInspecionados: 0,
  },
  {
    id: "303",
    inspecaoId: "101",
    nome: "2º Andar - Escritórios",
    ordem: 2,
    itensInspecionados: 0,
  },
  {
    id: "304",
    inspecaoId: "101",
    nome: "Casa de Máquinas (Topo)",
    ordem: 99,
    itensInspecionados: 0,
  },
];