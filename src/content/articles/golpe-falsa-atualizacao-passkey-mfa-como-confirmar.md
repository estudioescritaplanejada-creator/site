---
title: "Golpe da falsa atualização de passkey e MFA: como confirmar antes de cadastrar um novo acesso"
description: "Golpistas estão usando urgência sobre passkeys, MFA e SSO para conduzir vítimas a phishing e autorização indevida. Veja como confirmar antes de alterar a segurança da conta."
publishedAt: "2026-09-14"
updatedAt: "2026-09-14"
category: "protecao-digital"
themes:
  - "passkeys"
  - "MFA"
  - "engenharia social"
  - "phishing"
  - "segurança de contas"
author: "Estúdio Escrita Planejada"
draft: false
featured: false
seoTitle: "Golpe da falsa atualização de passkey e MFA: como confirmar"
socialTitle: "Passkey e MFA também viraram isca de golpe"
socialDescription: "Antes de seguir uma atualização urgente de autenticação, confirme origem, canal e alteração pedida."
imageAlt: "Alerta visual sobre falsa atualização de passkey e MFA com etapas para parar, confirmar a origem e só então alterar o acesso"
video:
  id: "36nIaSBJ7_U"
  title: "Synced Passkeys in Microsoft Entra for Phishing-resistant MFA"
  source: "Microsoft Mechanics"
image: "/assets/editorial/golpe-falsa-atualizacao-passkey-mfa-como-confirmar.webp"
---

Uma mensagem dizendo que sua passkey, MFA ou SSO precisa ser atualizada imediatamente pode parecer exatamente o tipo de aviso que uma empresa séria enviaria.

Esse é o problema.

Em 9 de setembro de 2026, a Microsoft publicou uma investigação sobre intrusões em nuvem nas quais os criminosos usavam justamente esse contexto. O contato chegava por ligação ou mensagem, muitas vezes em telefone pessoal, com alguém se passando pelo suporte de TI. A vítima era pressionada a "corrigir" ou "atualizar" a autenticação para evitar interrupção.

O objetivo nem sempre era roubar uma senha. Em alguns casos, o atacante conduzia a pessoa a um fluxo legítimo de autenticação por código de dispositivo e conseguia autorização para uma sessão controlada por ele. Depois, podia cadastrar um novo método de MFA para manter acesso.

A lição prática é simples: **uma solicitação de segurança também precisa ser autenticada**.

## Por que a história funciona

A abordagem usa três elementos que costumam baixar a guarda: linguagem de segurança, urgência e medo de perder acesso ao trabalho.

A pessoa pensa: "Se é sobre MFA, deve ser proteção".

Só que o tema segurança é apenas o pretexto. A Microsoft observou iscas sobre passkeys, MFA e SSO sendo usadas para conduzir usuários a phishing do tipo adversary-in-the-middle ou a fluxos de device code.

A aparência do site pode ser convincente. O domínio pode parecer corporativo. Em um ataque com código de dispositivo, a página de autenticação pode até ser legítima. O erro está na autorização que a vítima concede.

Por isso, a pergunta correta não é apenas "o site parece verdadeiro?". É: **quem iniciou esta alteração, por qual canal e qual acesso será criado ou autorizado no final?**

## Um site legítimo não torna a solicitação legítima

Em golpes tradicionais, conferir o endereço do site ajuda bastante. Em ataques por código de dispositivo, porém, o usuário pode ser levado a uma página oficial de login e ainda assim autorizar um acesso que não pretendia conceder.

A página é verdadeira. O pedido é que é fraudulento.

Isso mostra por que segurança não pode depender de um único sinal.

Antes de cadastrar uma passkey, adicionar autenticador, aprovar um código ou confirmar uma sessão, valide também a origem da solicitação.

## Use o protocolo PARE antes de alterar a autenticação

Para pequenos negócios, vale adotar um protocolo simples:

| Etapa | Pergunta | Ação |
| --- | --- | --- |
| **P**are | A solicitação apareceu de surpresa? | Não continue durante a ligação ou conversa |
| **A**utentique a origem | Quem está pedindo isso? | Confirme por canal já conhecido |
| **R**evise o acesso | O que será cadastrado ou autorizado? | Leia a tela antes de aceitar |
| **E**xecute só depois | A mudança faz sentido e foi confirmada? | Faça pela configuração oficial do serviço |

O objetivo não é decorar uma sigla. É criar uma pausa obrigatória entre a urgência e a alteração de segurança.

## Como confirmar um suporte que entrou em contato

Se alguém disser que sua autenticação precisa ser atualizada, encerre a conversa ou coloque a solicitação em espera. Não use o link enviado pelo próprio contato. Abra o portal do serviço pelo endereço que você já conhece e use um telefone, e-mail ou canal oficial previamente registrado.

Confirme se existe uma mudança real pendente para sua conta. Só então faça a alteração.

Em uma equipe, essa regra precisa ser conhecida antes do incidente. Se cada pessoa improvisa quando alguém diz "sou do suporte", o golpe já começa com vantagem.

## O que conferir na tela de autenticação

Antes de aprovar, confira qual aplicativo está pedindo acesso, qual conta está sendo usada, qual método será cadastrado, se o dispositivo é seu, se o local e o horário fazem sentido e se você iniciou a ação.

Se a tela pedir aprovação para algo que você não começou, pare.

Não aceite apenas para "ver o que acontece".

## Novo método de MFA que você não reconhece é sinal importante

Na investigação da Microsoft, depois da entrada inicial, os criminosos buscavam persistência cadastrando um método de MFA sob controle deles.

Isso significa que, depois de um contato suspeito, não basta trocar a senha.

Revise dispositivos, sessões, métodos de autenticação, aplicativos autorizados, encaminhamentos de e-mail e permissões concedidas.

Se aparecer um telefone, autenticador ou método que você não cadastrou, trate como incidente.

O artigo [organize os acessos digitais do seu negócio](/guias/organize-os-acessos-digitais-do-seu-negocio/) ajuda a estruturar essa revisão.

## Se você já seguiu as instruções

Se você clicou, digitou código, aprovou sessão ou cadastrou algo seguindo uma solicitação suspeita, não espere um sinal visível de invasão.

Uma sequência conservadora é interromper novas aprovações, avisar o responsável técnico ou administrador, revogar sessões quando possível, remover métodos de autenticação desconhecidos, alterar credenciais conforme orientação oficial e revisar e-mail, arquivos e compartilhamentos.

Se a conta é administrativa, a urgência é maior porque o alcance do acesso também é maior. Veja [por que manter uma conta de administrador separada do trabalho diário](/guias/conta-administrador-separada-trabalho-diario/).

## Passkey continua sendo uma boa proteção

O fato de criminosos usarem passkey como tema de golpe não significa que passkeys sejam inseguras.

A própria Microsoft destaca passkeys como forma de autenticação resistente a phishing quando implementadas corretamente.

O ataque estudado explora a pessoa e o processo de cadastro, não uma necessidade de abandonar a tecnologia.

## A regra que vale para qualquer atualização de segurança

Sempre que alguém disser "sua autenticação vai parar", "cadastre esta chave agora", "aprove este código" ou "precisamos resetar seu MFA", trate como uma alteração de alto impacto.

Confirme fora do canal que trouxe a urgência.

Essa regra também vale para e-mail, WhatsApp, banco, hospedagem, domínio e qualquer serviço que concentre acesso ao negócio.

Se você recebeu um link e ainda não sabe se é legítimo, use também [cliquei em um link suspeito: o que fazer](/guias/cliquei-em-um-link-suspeito-o-que-fazer/).

## Fontes consultadas

- Microsoft Security Blog, "Passkey-themed social engineering leads to identity and cloud compromise", 09/09/2026: https://www.microsoft.com/en-us/security/blog/2026/09/09/passkey-themed-social-engineering-leads-identity-cloud-compromise/
- Microsoft Mechanics, "Synced Passkeys in Microsoft Entra for Phishing-resistant MFA": https://www.youtube.com/watch?v=36nIaSBJ7_U
