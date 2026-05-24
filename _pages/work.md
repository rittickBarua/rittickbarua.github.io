---
layout: archive
title: "Work"
description: "Selected applied-AI and machine-learning projects by Rittick Barua: an enterprise language-model platform, a deep-learning microscopy segmentation pipeline and a property-valuation ML tool."
permalink: /work/
author_profile: true
---

A selection of applied AI, machine-learning and product-engineering projects, mixing client engagements with self-directed research. Each links through to a fuller write-up.

{% assign projects = site.work | sort: "weight" %}
{% for p in projects %}
## [{{ p.title }}]({{ p.permalink }})

*{{ p.tagline }}*

{{ p.excerpt }}

[Read more]({{ p.permalink }})
{% endfor %}
