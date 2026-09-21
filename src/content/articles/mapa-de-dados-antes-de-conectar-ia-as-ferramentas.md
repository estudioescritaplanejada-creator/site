---
title: "Como montar um mapa de dados antes de conectar a IA às ferramentas do seu negócio"
description: "Antes de conectar IA a e-mail, Drive, CRM ou financeiro, registre que dados existem em cada sistema, quem é responsável e o que a IA pode ler ou alterar."
publishedAt: "2026-09-21"
updatedAt: "2026-09-21"
category: "ferramentas-e-ia"
themes:
  - "dados"
  - "inteligência artificial"
  - "LGPD"
  - "permissões"
  - "integrações"
author: "Estúdio Escrita Planejada"
draft: false
featured: false
seoTitle: "Mapa de dados antes de conectar IA às ferramentas"
socialTitle: "Antes de conectar a IA, descubra onde seus dados vivem"
socialDescription: "Mapeie sistema, dado, responsável, sensibilidade e permissão antes de liberar leitura ou alteração por IA."
imageAlt: "E-mail, Drive, CRM, financeiro e tarefas convergindo para um mapa de dados antes de serem conectados à inteligência artificial"
video:
  id: "c8O4zHCzofM"
  title: "Mapeamento de dados: o que é e como fazer?"
  source: "LGPD para Cartórios"
image: "/assets/editorial/mapa-de-dados-antes-de-conectar-ia-as-ferramentas.webp"
---

Conectar uma ferramenta de IA ao e-mail, Drive ou CRM pode levar poucos cliques.

Entender o que você acabou de autorizar pode levar mais tempo.

Antes de conectar, faça um mapa simples dos dados do negócio.

Não precisa começar com projeto sofisticado de governança.

Uma tabela já responde perguntas que normalmente aparecem tarde demais.

## O que é um mapa de dados

Para este artigo, mapa de dados é um inventário operacional:

- quais sistemas você usa;
- que informação existe em cada um;
- quem é responsável;
- quão sensível é;
- quem tem acesso;
- o que a IA deveria poder fazer.

A ANPD disponibiliza para agentes de pequeno porte um modelo de registro das operações de tratamento de dados pessoais e um checklist de segurança.

Você não precisa transformar a rotina numa auditoria jurídica.

Mas a ideia de inventariar tratamento e aplicar controles proporcionais é uma boa base.

## Comece pelos sistemas

Liste:

- e-mail;
- armazenamento em nuvem;
- CRM;
- financeiro;
- tarefas;
- suporte;
- site;
- formulários;
- planilhas;
- ferramentas de marketing.

Não pense ainda na IA.

Descubra primeiro onde a operação vive.

## Depois liste os tipos de dado

Exemplo:

### E-mail

- conversas com clientes;
- propostas;
- anexos;
- dados de contato.

### Drive

- contratos;
- apresentações;
- documentos;
- planilhas.

### CRM

- nome;
- telefone;
- estágio;
- histórico comercial.

### Financeiro

- valores;
- pagamentos;
- dados fiscais;
- recebimentos.

Essa visão já mostra que "conectar o Workspace" pode significar acessar informações muito diferentes.

## Crie uma tabela mínima

Use:

| Sistema | Dado | Dono | Sensibilidade | IA pode ler? | IA pode alterar? |
| --- | --- | --- | --- | --- | --- |
| Gmail | Conversas de clientes | Atendimento | Alta | Parcial | Não |
| Drive | Modelos públicos | Marketing | Baixa | Sim | Não |
| CRM | Pipeline | Vendas | Média | Sim | Com controle |
| Financeiro | Pagamentos | Financeiro | Alta | Restrito | Não |

Não existe resposta universal.

O objetivo é forçar uma decisão consciente.

## "Dono" não significa proprietário legal

Aqui, dono é responsável operacional.

Quem sabe:
- para que o dado existe;
- quem deveria usar;
- quando atualizar;
- quando excluir;
- como corrigir.

Sem responsável, integração vira terreno sem regra.

## Classifique sensibilidade de forma simples

Você pode começar com três níveis:

### Baixa

Informação pública ou pouco crítica.

### Média

Informação interna que não deveria ser aberta indiscriminadamente.

### Alta

Dados pessoais, financeiros, credenciais, contratos ou informação comercial sensível.

Essa classificação é operacional.

Não substitui análise jurídica da LGPD.

Serve para priorizar cuidado.

## Pergunte o que a IA realmente precisa

Se o objetivo é resumir tarefas atrasadas, a IA precisa do financeiro?

Não.

Se o objetivo é responder perguntas sobre estoque, precisa de e-mail completo?

Talvez não.

Aplique minimização:

**dê acesso ao necessário para o caso de uso.**

O fato de uma plataforma permitir "conectar tudo" não significa que você deveria.

## Separe leitura de alteração

É uma das decisões mais importantes.

### Ler

A IA consulta informação.

### Criar

A IA adiciona algo novo.

### Alterar

A IA modifica algo existente.

### Excluir

A IA remove.

Cada nível aumenta consequência.

Comece com leitura quando o ganho já aparece sem escrita.

## Dados de clientes merecem atenção especial

Antes de enviar ou expor dados pessoais a um serviço:
- identifique finalidade;
- verifique contrato;
- entenda acesso;
- aplique controles;
- reduza o que é desnecessário.

A ANPD recomenda medidas técnicas e administrativas proporcionais à realidade e aos riscos de agentes de pequeno porte.

Pequeno não significa dispensado de cuidado.

## Credenciais não entram no mapa como dado comum

Senha, token e chave de API exigem tratamento específico.

Não cole credenciais em prompts.

Use mecanismos de autenticação e cofres apropriados quando a integração exigir.

O mapa deve registrar que a credencial existe e quem administra, não expor o segredo.

## Cuidado com cópias

Uma informação pode existir em:
- CRM;
- planilha;
- e-mail;
- arquivo exportado.

Qual é a fonte oficial?

Se a IA cruza cópias diferentes, pode encontrar valores incompatíveis.

Marque:

`FONTE OFICIAL = CRM`

Isso ajuda a resolver conflito.

## Conector novo precisa passar pelo mapa

Sempre que alguém quiser conectar:
- nova IA;
- automação;
- plugin;
- agente;

adicione uma linha:

- o que acessa;
- para quê;
- quem aprovou;
- data;
- como desligar.

Isso evita acumular integrações esquecidas.

## Faça revisão periódica

Uma vez por trimestre, pergunte:

- sistema ainda é usado?
- dados ainda precisam estar lá?
- integração ainda é necessária?
- usuário ainda trabalha na empresa?
- permissão continua adequada?
- IA passou a ter novos recursos?

Ferramentas mudam.

Seu mapa precisa acompanhar.

## Um caso prático

Objetivo:

> Usar IA para preparar resumo semanal do CRM.

Mapa indica:
- precisa ler oportunidades;
- não precisa ler dados bancários;
- não precisa alterar estágio;
- não precisa excluir registros.

Permissão inicial:

`LER PIPELINE`

não:

`ACESSO TOTAL AO CRM`

O ganho pode ser o mesmo com risco menor.

## Comece antes da ferramenta

Se você montar o mapa só depois de conectar, estará tentando descobrir o alcance de uma decisão já tomada.

Faça o contrário:

1. caso de uso;
2. sistema;
3. dados;
4. permissão;
5. conexão;
6. teste;
7. revisão.

Essa sequência transforma integração em decisão operacional.

## Fontes consultadas

- ANPD, "Guia orientativo sobre segurança da informação para agentes de tratamento de pequeno porte": https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte
- ANPD, materiais educativos e modelo de registro das operações de tratamento: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes
- "Mapeamento de dados: o que é e como fazer?": https://www.youtube.com/watch?v=c8O4zHCzofM
