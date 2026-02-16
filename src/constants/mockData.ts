import { Funcionario, Inspecao, Item, Obra, Pavimento } from "../types";

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

export const DOCUMENTOS_VENCENDO_MOCK: Record<string, number> = {
  "1": 7,
  "2": 2,
  "3": 0,
};

export const INSPECOES_MOCK: Inspecao[] = [
  {
    id: "101",
    obraId: "1",
    data: "2026-02-09T08:30:00.000Z", 
    tecnico: "Pedro Almeida",
    status: "em-andamento",
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
  {
    id: "301",
    inspecaoId: "101",
    nome: "Térreo / Hall de Entrada",
    ordem: 0,
    itensInspecionados: 0,
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
];

export const ITENS_MOCK: Item[] = [
  {
    id: "501",
    pavimentoId: "301",
    tituloInconformidade: "Abertura de janela sem proteção coletiva",
    artigosNorma: "18.9.1 É obrigatória a instalação de proteção coletiva...",
    observacoes: "Risco grave.",
    // AGORA AS FOTOS SÃO OBJETOS
    fotos: [
      { uri: "foto1.jpg", data: "15/02/2026 10:30" },
      { uri: "foto2.jpg", data: "15/02/2026 10:32" }
    ],
  },
  {
    id: "502",
    pavimentoId: "301",
    tituloInconformidade: "Falta de sinalização na saída de emergência",
    artigosNorma: "18.28.1 O canteiro de obras deve possuir sinalização...",
    observacoes: "",
    fotos: [],
  },
  {
    id: "503",
    pavimentoId: "301",
    tituloInconformidade: "Fios expostos no corredor de acesso",
    artigosNorma: "10.2.8.2 As partes vivas expostas devem ser isoladas...",
    observacoes: "Isolar a área imediatamente.",
    fotos: [
      { uri: "foto_fio.jpg", data: "15/02/2026 11:00" }
    ],
  }
];

export const FUNCIONARIOS_MOCK: Funcionario[] = [
  {
    id: "f1",
    obraId: "1", // Edifício Comercial Santos
    nome: "Maria Oliveira Costa",
    cargo: "Encarregada",
    documentos: [
      { id: "d1", tipo: "NR-10", dataVencimento: "2026-01-29", status: "vencido" },
      { id: "d2", tipo: "ASO", dataVencimento: "2026-08-01", status: "vigente" }
    ]
  },
  {
    id: "f2",
    obraId: "1",
    nome: "Ana Paula Rodrigues",
    cargo: "Servente",
    documentos: [
      { id: "d3", tipo: "ASO", dataVencimento: "2026-02-04", status: "vencido" }
    ]
  },
  {
    id: "f3",
    obraId: "2", // Residencial Jardim América
    nome: "Roberto Alves Mendes",
    cargo: "Pedreiro",
    documentos: [
      { id: "d4", tipo: "NR-35", dataVencimento: "2026-03-01", status: "vence-30-dias" }
    ]
  },
  {
    id: "f4",
    obraId: "3", // Shopping Center Norte
    nome: "Carlos Lima",
    cargo: "Eletricista",
    documentos: [
      { id: "d5", tipo: "NR-10", dataVencimento: "2026-12-01", status: "vigente" }
    ]
  }
];