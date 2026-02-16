// src/types/index.ts

export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  tecnico: string;
  empresaNome: string;
  // NOVOS CAMPOS
  empresaCnpj?: string;
  empresaTelefone?: string;
  empresaEmail?: string;
  empresaLogo?: string; // URI da imagem
  dataInicio: string;
  status: 'ativa' | 'pausada' | 'concluida';
}

export interface Inspecao {
  id: string;
  obraId: string;
  data: string;
  tecnico: string;
  status: 'em-andamento' | 'concluida';
  // NOVOS CAMPOS PARA O RELATÓRIO PDF
  descricao?: string; // O texto introdutório longo
  fotoCapa?: string;  // URI da foto de capa
}

export interface Pavimento {
  id: string;
  inspecaoId: string;
  nome: string;
  ordem: number;
  itensInspecionados: number; // Mantido para compatibilidade
}

// NOVA INTERFACE PARA FOTO
export interface Foto {
  uri: string;
  data: string; // Data e Hora da captura
}

export interface Item {
  id: string;
  pavimentoId: string;
  tituloInconformidade: string;
  artigosNorma: string;
  observacoes?: string;
  // MUDANÇA AQUI: De string[] para Foto[]
  fotos: Foto[]; 
}

export interface Documento {
  id: string;
  tipo: string; // Ex: "NR-10", "ASO", "NR-35"
  dataVencimento: string; // ISO Date (YYYY-MM-DD)
  status: 'vigente' | 'vencido' | 'vence-30-dias';
}

export interface Funcionario {
  id: string;
  obraId: string;
  nome: string;
  cargo: string;
  documentos: Documento[];
}