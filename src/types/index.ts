// src/types/index.ts

export interface Obra {
  id: string;
  nome: string;
  descricao?: string;
  status: number; // 1: Ativa, etc (conforme SQL)
  empresa_id: string;
  construtora_id?: string;
  cno?: string;
  cep?: string;
  endereco: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_referencia?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  // Campos legados ou calculados para a UI
  tecnico?: string;
  empresaNome?: string;
}

export interface Inspecao {
  id: string;
  obra_id: string;
  funcionario_id?: string;
  construtora_id?: string;
  cadastrado_em: string;
  cadastrado_por?: string;
  token?: string;
  assinado?: boolean;
  assinatura?: string;
  // Campos para o relatório PDF (podem ser mapeados de outras tabelas ou metadados)
  descricao?: string; 
  fotoCapa?: string;
  status?: 'em-andamento' | 'concluida';
}

export interface Pavimento {
  id: string;
  obra_id: string;
  checklist_id?: string;
  construtora_id?: string;
  empresa_id?: string;
  nome: string;
  ordem: number;
}

export interface Item {
  id: string;
  pavimento_id: string;
  obra_id?: string;
  nome: string; // Título da inconformidade
  descricao?: string; // Artigos da norma / Observações
  ordem: number;
  imagem?: string; // Foto principal
  // Suporte a múltiplas fotos se necessário (extensão do esquema)
  fotos?: Foto[]; 
}

export interface Foto {
  uri: string;
  data: string;
}

export interface Documento {
  id: string;
  funcionario_id: string;
  obra_id: string;
  anexo: string; // URL/Caminho do arquivo
  tipo_id: string;
  descricao: string;
  cadastrado_em: string;
  vence_em: string;
  status?: 'vigente' | 'vencido' | 'vence-30-dias';
}

export interface Funcionario {
  id: string;
  nome: string;
  cpf?: string;
  cargo_id?: string;
  empresa_id?: string;
  status?: number;
  // Relacionamentos
  documentos?: Documento[];
}
