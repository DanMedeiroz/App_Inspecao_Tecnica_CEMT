// src/constants/mockData.ts
import { Funcionario, Inspecao, Item, Obra, Pavimento } from "../types";

export const OBRAS_MOCK: Obra[] = [
  {
    id: "1",
    nome: "Edifício Comercial Santos",
    endereco: "Av. Paulista, 1000",
    endereco_numero: "1000",
    endereco_cidade: "São Paulo",
    endereco_estado: "SP",
    status: 1,
    empresa_id: "10",
    empresaNome: "Construtora Santos",
    tecnico: "João Silva",
  },
  {
    id: "2",
    nome: "Residencial Jardim América",
    endereco: "Rua das Flores, 250",
    endereco_numero: "250",
    endereco_cidade: "São Paulo",
    endereco_estado: "SP",
    status: 1,
    empresa_id: "11",
    empresaNome: "Jardim Empreendimentos",
    tecnico: "Maria Santos",
  }
];

export const INSPECOES_MOCK: Inspecao[] = [
  {
    id: "101",
    obra_id: "1",
    cadastrado_em: "2026-02-09T08:30:00.000Z",
    status: "em-andamento",
    descricao: "Foi realizada a inspeção na obra com o objetivo de avaliar as condições de segurança...",
  },
];

export const PAVIMENTOS_MOCK: Pavimento[] = [
  {
    id: "301",
    obra_id: "1",
    nome: "Térreo / Hall de Entrada",
    ordem: 0,
  },
  {
    id: "302",
    obra_id: "1",
    nome: "1º Andar - Garagem",
    ordem: 1,
  }
];

export const ITENS_MOCK: Item[] = [
  {
    id: "501",
    pavimento_id: "301",
    nome: "Abertura de janela sem proteção coletiva",
    descricao: "18.9.1 É obrigatória a instalação de proteção coletiva... Risco grave.",
    ordem: 0,
    imagem: "foto1.jpg",
    fotos: [
      { uri: "foto1.jpg", data: "15/02/2026 10:30" },
      { uri: "foto2.jpg", data: "15/02/2026 10:32" }
    ],
  }
];

export const FUNCIONARIOS_MOCK: Funcionario[] = [
  {
    id: "f1",
    nome: "Maria Oliveira Costa",
    cargo_id: "1",
    empresa_id: "10",
  }
];
