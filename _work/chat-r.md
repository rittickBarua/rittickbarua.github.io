---
title: "Chat:R — an enterprise language-model platform"
collection: work
weight: 1
permalink: /work/chat-r/
date: 2025-01-01
tagline: "Enterprise LLM platform · LibreChat, Azure, React/Node.js · 2025–present"
description: "Chat:R — an extended LibreChat deployment serving ~1,000 staff at a public-affairs consultancy, with a SharePoint MCP gateway and three bespoke enterprise features."
excerpt: "An extended LibreChat deployment serving roughly 1,000 staff at a European public-affairs consultancy, with a purpose-built SharePoint Model Context Protocol gateway and three bespoke enterprise features."
---

**Role:** Product and delivery lead &nbsp;·&nbsp; **Client:** Rud Pedersen Group &nbsp;·&nbsp; **Timeline:** 2025–present

Chat:R is an enterprise language-model platform I designed and delivered for Rud Pedersen Group, a European public-affairs and strategic-communications consultancy. It serves approximately 1,000 staff across three Azure environments.

## The problem

The firm's consultants had begun pasting client briefings, policy positions, and personally identifying material into public language-model tools — an untenable privacy exposure. The off-the-shelf options were each unsuitable: ChatGPT Enterprise resolved data residency but locked the firm to a single model, an awkward per-seat commercial model at roughly a thousand staff, and a feature set the firm could not extend on its own terms. What was needed was a ChatGPT-shaped interface deployed inside the firm's own Microsoft tenant, extensible to its working patterns, and owned as an asset rather than rented as a subscription.

## What I built

Starting from [LibreChat](https://librechat.ai) — the most credible open-source language-model platform at the time — rather than rebuilding the generic eighty per cent from first principles, the engagement focused on the twenty per cent that determined whether the system was genuinely useful. Three bespoke enterprise features sit above the extended platform:

- **Projects** — a workspace layer grouping conversations, agents, and files by client or brief, modelled as a first-class MongoDB entity with REST endpoints and a virtualised React sidebar.
- **Project-to-agent linking** — an agent picker that surfaces each agent's provider, model, tools, and file scope, so specialised agents can be attached to a project without the consultant leaving it.
- **SharePoint MCP gateway** — a Node.js Model Context Protocol server exposing a curated set of Microsoft Graph tools over a streamable HTTP transport, with credentials injected from Azure Key Vault.

## Engineering decisions worth naming

- **Virtual machines over managed Kubernetes.** A cost and operational review after the first environment was stood up led to a considered pivot to Azure VMs — monthly infrastructure cost fell to roughly half the initial design, with no practical loss of reliability for this class of workload.
- **Microsoft Entra single sign-on**, domain-scoped so that only authenticated firm identities are admitted, with Entra group membership driving application-level authorisation.
- **Project-scoped retrieval** — file search runs automatically within the active project; web search, where enabled, routes through a provider-neutral API with full-content ingestion and reranking.

## Outcome

A platform the firm owns outright — codebase, infrastructure-as-code, and deployment pipelines — running across development, staging, and production, with all conversation history and uploaded files remaining inside the firm's Microsoft tenancy.

**Stack:** LibreChat (extended), React, Node.js, MongoDB, Microsoft Azure (VMs, Key Vault), Bicep, Microsoft Entra, GitHub Actions.

[Read the full case study](https://nokshi-tech.pages.dev/work/chat-r/){:target="_blank" rel="noopener noreferrer"}
