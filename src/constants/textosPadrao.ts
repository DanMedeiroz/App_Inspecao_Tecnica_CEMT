// src/constants/textosPadrao.ts

interface TextoPadrao {
  titulo: string;
  artigos: string;
}

export const TEXTOS_PADRAO: Record<string, TextoPadrao[]> = {
  "Proteção Coletiva": [
    {
      titulo: "Abertura de janela sem proteção coletiva",
      artigos: "18.9.1 É obrigatória a instalação de proteção coletiva onde houver risco de queda de trabalhadores ou de projeção de materiais."
    },
    {
      titulo: "Periferia sem guarda-corpo",
      artigos: "18.9.1.1 As proteções coletivas devem ser projetadas e construídas de modo a resistir às cargas aplicadas."
    },
    {
      titulo: "Falta de fechamento no poço do elevador",
      artigos: "18.9.2 As aberturas no piso devem ter fechamento provisório resistente."
    }
  ],
  "EPIs": [
    {
      titulo: "Falta de uso de capacete",
      artigos: "6.6.1 O empregador é obrigado a fornecer aos empregados, gratuitamente, EPI adequado ao risco."
    },
    {
      titulo: "Falta de cinto de segurança em altura",
      artigos: "35.5.1 É obrigatório o uso de sistema de proteção contra quedas sempre que não for possível evitar o trabalho em altura."
    }
  ],
  "Instalações Elétricas": [
    {
      titulo: "Fios expostos em área de circulação",
      artigos: "18.21.1 As execuções das instalações elétricas temporárias e definitivas devem atender ao disposto na NR-10."
    },
    {
      titulo: "Quadro de distribuição sem porta/proteção",
      artigos: "10.2.8.2 As partes vivas expostas de circuitos e equipamentos elétricos devem ser protegidas."
    }
  ]
};