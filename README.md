# App Inspeção de Segurança CEMT 👷‍♂️📱

**Versão:** 1.1.0  •  **Status:** Em desenvolvimento (Fase 3 - Core Features)

**Última atualização:** 15/02/2026

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Instalação](#instalação)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Fluxo e Funcionalidades](#fluxo-e-funcionalidades)
- [Modelo de Dados](#modelo-de-dados)
- [Design System](#design-system)
- [Contatos](#contatos)

---

## Visão Geral

O App CEMT é uma aplicação mobile offline-first para inspeções de segurança do trabalho em canteiros. Substitui pranchetas, reduz retrabalho e permite registrar conformidades, evidenciar riscos com fotos e gerar relatórios diretamente no celular.

Principais diferenciais:

- **Acesso imediato:** fluxo sem login para agilidade em campo.
- **Foco na tarefa:** interface limpa, priorizando coleta de dados.
- **Offline-ready:** suporte a operação sem internet (mock data local hoje).

## Stack Tecnológica 🛠️

Escolha pensada para velocidade de desenvolvimento e manutenção.

| Categoria | Tecnologia | Justificativa |
|---|---|---|
| Framework | React Native (Expo SDK 52+) | Desenvolvimento híbrido rápido e acesso a APIs nativas |
| Linguagem | TypeScript | Tipagem, intellisense e menos bugs em runtime |
| Roteamento | Expo Router | File-based routing, similar ao Next.js |
| Estilização | StyleSheet nativo | Performance sem dependências pesadas |
| Ícones | @expo/vector-icons | Biblioteca leve e completa |
| Backend (simulado) | Mock Data local | Validação rápida de UI/UX antes da integração |

## Instalação ⚙️

Pré-requisitos:

- Node.js (LTS)
- Android Studio (SDK + emulador) ou dispositivo com Expo Go

Passos rápidos:

```bash
git clone https://github.com/DanMedeiroz/App_Inspecao_Tecnica_CEMT.git
cd App_Inspecao_Tecnica_CEMT
npm install
# se houver problemas: npx expo install --fix

# rodar no emulador Android
npm run android

# rodar via Expo (QR Code)
npx expo start
```

## Arquitetura do Projeto 🏗️

Separação clara entre rotas (`app/`) e lógica/UI (`src/`).

Estrutura (resumida):

```
/
├── app/                      # Rotas (Expo Router)
│   ├── _layout.tsx           # Config. global de navegação
│   ├── index.tsx             # Entrada (redireciona para obras)
│   ├── obras/[id]/inspecoes.tsx
│   └── inspecoes/[id]/pavimentos.tsx
├── src/                      # Código fonte
│   ├── assets/               # Imagens estáticas
│   ├── components/           # Componentes reutilizáveis
│   ├── constants/            # mockData.ts
│   ├── screens/              # Telas (obras, inspeções)
│   └── types/                # Interfaces TypeScript
```

## Fluxo e Funcionalidades 📱

1) Tela inicial — **Lista de Obras** (`/`)

- Visão geral dos canteiros ativos
- Header com logo CEMT e alertas visuais
- Acesso direto sem login

2) Lista de Inspeções — **/obras/[id]/inspecoes**

- Histórico filtrado por obra
- Cards com data/hora
- Botão **+ Nova Inspeção**

3) Pavimentos — **/inspecoes/[id]/pavimentos**

- Listagem de locais (Térreo, 1º Andar, Cobertura)
- Ícones de camadas e feedback limpo

## Modelo de Dados (excertos)

As principais interfaces estão em `src/types/index.ts`:

```ts
export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  tecnico: string;
  empresaNome: string;
  status: 'ativa' | 'pausada' | 'concluida';
}

export interface Inspecao {
  id: string;
  obraId: string;
  data: string; // ISO 8601
  tecnico: string;
  status: 'em-andamento' | 'concluida';
}

export interface Pavimento {
  id: string;
  inspecaoId: string;
  nome: string;
  ordem: number;
}
```

## Design System 🎨

- **Primary:** #1F5F38 (Verde CEMT)
- **Danger:** #DC2626
- **Surface:** #FFFFFF
- **Background:** #F9FAFB

Tipografia: fontes nativas (San Francisco no iOS, Roboto no Android).

## Contatos e Responsáveis 👥

- Product Owner: Clínica CEMT
- Tech Lead: Daniel Fernandes Medeiros
- Designer: Daniel Fernandes Medeiros
- Especialista em Segurança do Trabalho: Franco Steffen Fernandes

---

Se quiser, eu posso também: atualizar o `package.json` com badges, gerar um `CONTRIBUTING.md` ou criar um badge de build/CI. Deseja que eu faça algum desses próximos passos?