---
title: "London Property Finder, applied machine learning"
collection: work
weight: 3
permalink: /work/london-property/
date: 2026-01-01
tagline: "Applied ML · XGBoost, quantile regression, geospatial · self-directed research"
description: "London Property Finder, an interactive tool scoring live London listings against a stacked ML ensemble trained on 2.18 million Land Registry transactions."
excerpt: "An interactive single-page tool that scores live London property listings against a stacked machine-learning ensemble trained on 2.18 million Land Registry transactions, to test whether public data alone can identify mispriced homes."
---

**Role:** Applied machine learning, self-directed research. **Timeline:** 2026.

An interactive tool that scores live London property listings against a stacked machine-learning ensemble, built to test whether publicly available data alone can identify mispriced homes.

## The question

Most house-price models predict a number and stop. The question here is sharper: using only publicly available data, can a model flag which current listings look mispriced relative to comparable sold properties, and can the resulting tool be interrogated by the user rather than trusted blindly?

## Approach

- **Training data.** 2.18 million Land Registry transactions spanning 1995 to 2026, deflated to a common reference with the House Price Index.
- **Model.** A stacked ensemble of per-property-type, Optuna-tuned XGBoost base learners feeding a quantile-loss meta-learner, producing an 80% prediction interval for every property rather than a bare point estimate.
- **Tool.** A single-page interface scoring roughly 5,300 live London listings, with sold-nearby comparables drawn from the Land Registry, filter and map views, multi-key sorting and CSV / XLSX export.

## Result

- A gap mean-absolute-error of **£38,832**, a 32% reduction over the baseline.
- **68.3%** of predictions within ±10% of the asking price.
- An IAAO coefficient of dispersion of 8.6, in the "excellent" band, with a price-related differential near 1.0 indicating no systematic vertical inequity.

**Stack:** Python, XGBoost, Optuna, quantile regression, geospatial analysis and a stacked meta-learner architecture.

[Open the live tool and case study](https://nokshi-tech.pages.dev/work/london-property/){:target="_blank" rel="noopener noreferrer"}
