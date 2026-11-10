---
layout: archive
title: "Work"
description: "Work by Rittick Barua in two groups. AI/ML work: an enterprise language-model platform, a deep-learning microscopy segmentation pipeline and a property-valuation ML tool. Academic work: published research papers."
permalink: /work/
author_profile: true
---

My work falls into two groups: applied AI and machine learning, and academic research. Each card opens a fuller write-up, and its labels show the areas of expertise it draws on.

## AI/ML work

A selection of applied AI, machine-learning and product-engineering projects, mixing client engagements with self-directed research.

{% assign projects = site.work | sort: "weight" %}
{% assign papers = site.publications | sort: "date" | reverse %}
<div class="cards">
{% for p in projects %}
  <a class="card card--{% cycle 'aiml': 'blue', 'amber', 'teal' %}" href="{{ p.permalink }}">
    <h3 class="card__title">{{ p.title }}</h3>
    <p class="card__meta">{{ p.tagline }}</p>
    <p>{{ p.excerpt | strip_html | strip }}</p>
    <span class="card__foot">
      <span class="card__labels">
        {% for l in p.labels %}<span class="chip">{{ l }}</span>{% endfor %}
      </span>
      <span class="card__arrow" aria-hidden="true">→</span>
    </span>
  </a>
{% endfor %}
{% for pub in papers %}{% if pub.category == "whitepapers" %}
  <a class="card card--{% cycle 'aiml': 'blue', 'amber', 'teal' %}" href="{{ pub.permalink }}">
    <h3 class="card__title">{{ pub.title }}</h3>
    <p class="card__meta">{{ pub.venue }} · {{ pub.year }}</p>
    <p>{{ pub.excerpt | strip_html | strip }}</p>
    <span class="card__foot">
      <span class="card__labels">
        {% for l in pub.labels %}<span class="chip">{{ l }}</span>{% endfor %}<span class="chip">{{ pub.publication_type }}</span>
      </span>
      <span class="card__arrow" aria-hidden="true">→</span>
    </span>
  </a>
{% endif %}{% endfor %}
</div>

## Academic work

Peer-reviewed and conference papers from my research in chemical engineering.

<div class="cards">
{% for pub in papers %}{% unless pub.category == "whitepapers" %}
  <a class="card card--{% cycle 'academic': 'blue', 'amber', 'teal' %}" href="{{ pub.permalink }}">
    <h3 class="card__title">{{ pub.title }}</h3>
    <p class="card__meta">{{ pub.venue }} · {{ pub.year }}</p>
    <p>{{ pub.excerpt | strip_html | strip }}</p>
    <span class="card__foot">
      <span class="card__labels">
        {% for l in pub.labels %}<span class="chip">{{ l }}</span>{% endfor %}<span class="chip">{{ pub.publication_type }}</span>
      </span>
      <span class="card__arrow" aria-hidden="true">→</span>
    </span>
  </a>
{% endunless %}{% endfor %}
</div>
