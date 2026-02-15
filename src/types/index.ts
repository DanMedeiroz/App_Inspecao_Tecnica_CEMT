// src/types/index.ts

export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  tecnico: string;
  empresaNome: string;
  empresaCnpj?: string;
  empresaLogo?: string;
  dataInicio: string;
  status: 'ativa' | 'pausada' | 'concluida';
}

export interface Inspecao {
  id: string;
  obraId: string;
  data: string;
  tecnico: string;
  status: 'em-andamento' | 'concluida';
  observacoes?: string;
}

export interface Pavimento {
  id: string;
  inspecaoId: string;
  itensInspecionados: number;
  nome: string;
  ordem: number;
}

export interface Item {
  id: string;
  pavimentoId: string;
  tituloInconformidade: string;
  artigosNorma: string;
  observacoes?: string;
  fotos: string[];
}