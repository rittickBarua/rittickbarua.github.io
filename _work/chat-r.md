---
title: "Chat:R, an enterprise language-model platform"
collection: work
weight: 1
permalink: /work/chat-r/
date: 2025-01-01
tagline: "Enterprise LLM platform · React, Node.js, MongoDB · Azure · 2025-present"
description: "Chat:R, an enterprise language-model platform serving roughly 1,000 staff at a public-affairs consultancy, with custom Projects, agent-linking and SharePoint MCP gateway features across three Azure environments."
excerpt: "An enterprise language-model platform serving roughly 1,000 staff at a European public-affairs consultancy, with custom Projects, agent-linking and SharePoint MCP gateway features, deployed across three Azure environments."
---

**Role:** Product and delivery lead. **Client:** Rud Pedersen Group. **Timeline:** 2025 to present.

Chat:R is an enterprise language-model platform I designed and led the delivery of for Rud Pedersen Group, a European public-affairs and strategic-communications consultancy. It serves approximately 1,000 staff across three Azure environments.

## The problem

The firm's consultants had begun pasting client briefings, policy positions and personally identifying material into public language-model tools, which created an unacceptable privacy exposure. Off-the-shelf alternatives were each unsuitable for a different reason: ChatGPT Enterprise resolved data residency but locked the firm to a single model, an awkward per-seat commercial structure at roughly a thousand staff and a feature set the firm could not extend on its own terms. What was needed was a ChatGPT-shaped interface deployed inside the firm's Microsoft tenant, extensible to its working patterns and held as an owned asset rather than a rented subscription.

## What was built

A bespoke React, Node.js and MongoDB application deployed on Azure, with three custom enterprise features:

- **Projects**, a workspace layer that groups conversations, agents and files by client or brief, modelled as a first-class MongoDB entity with REST endpoints and a virtualised React sidebar.
- **Project-to-agent linking**, an agent picker that surfaces each agent's provider, model, tool list and file scope, so that specialised agents can be attached to a project without the consultant having to leave it.
- **SharePoint MCP gateway**, a Node.js Model Context Protocol server exposing a curated set of Microsoft Graph tools over a streamable HTTP transport, with credentials injected from Azure Key Vault.

## Engineering decisions

- **Virtual machines over managed Kubernetes.** A cost and operational review after the first environment was stood up led to a considered pivot to Azure VMs. Monthly infrastructure cost fell to roughly half the initial design, with no practical reliability loss for this workload.
- **Microsoft Entra single sign-on**, domain-scoped so that only authenticated firm identities are admitted, with Entra group membership driving application-level authorisation.
- **Project-scoped retrieval.** File search runs automatically within the active project. Web search, where enabled, routes through a provider-neutral API with full-content ingestion and reranking.

## Outcome

A platform the firm owns outright across codebase, infrastructure-as-code and deployment pipelines, running across development, staging and production, with all conversation history and uploaded files remaining inside the firm's Microsoft tenancy.

**Stack:** React, Node.js, MongoDB, Microsoft Azure (VMs, Key Vault), Bicep, Microsoft Entra, GitHub Actions.

[Read the full case study](https://nokshi-tech.pages.dev/work/chat-r/){:target="_blank" rel="noopener noreferrer"}
