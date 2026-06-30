---
title: "London Property Finder, applied machine learning"
collection: work
weight: 3
permalink: /work/london-property/
date: 2026-01-01
tagline: "Applied ML · XGBoost, geospatial, leakage-free modelling · self-directed research"
description: "London Property Finder, an interactive tool scoring ~82,000 live London listings against a leakage-free gradient-boosted model trained on 2.18 million Land Registry transactions."
excerpt: "An interactive single-page tool that scores ~82,000 live London property listings against a leakage-free gradient-boosted model trained on 2.18 million Land Registry transactions, to test whether public data alone can identify mispriced homes."
---

**Role:** Applied machine learning, self-directed research. **Timeline:** 2026.

An interactive tool that scores live London property listings against a gradient-boosted machine-learning model, built to test whether publicly available data alone can identify mispriced homes.

## The question

Most house-price models predict a number and stop. The question here is sharper: using only publicly available data, can a model flag which current listings look mispriced relative to comparable sold properties, and can the resulting tool be interrogated by the user rather than trusted blindly?

## Approach

- **Training data.** 2.18 million Land Registry transactions spanning 1995 to 2026, deflated to a common reference with the House Price Index.
- **Model.** A single gradient-boosted regressor (XGBoost, Optuna-tuned) over 29 features drawn only from public sources — listing attributes, ONS area statistics, and spatial signals from nearby sold prices. An earlier stacked version was deliberately rebuilt to remove a subtle asking-price data leak, trading a flattering headline number for an honest, sold-price-only model whose mispricing signal is real rather than circular.
- **Tool.** A single-page interface scoring roughly 82,000 live London listings, with sold-nearby comparables drawn from the Land Registry, filter and map views, multi-key sorting and CSV / XLSX export.

## Result

- **~50%** of predictions land within ±10% of the actual sold price on held-out data, with a median absolute error under 10% and a mean absolute error of about **£96,000** — measured with no asking-price leakage.
- On a fresh scrape of ~90,000 live Rightmove listings (enriched through a leakage-free pipeline), a median absolute gap of **15.9%** between the model's valuation and the asking price — tighter than the earlier leaked model, despite using no asking-price information at all.
- The headline accuracy is lower than the earlier leaked version *by design*: removing the leak is what makes the numbers honest and the mispricing signal trustworthy.

**Stack:** Python, XGBoost, Optuna, geospatial analysis, leakage-free feature engineering and a Land-Registry comparables engine.

[Open the live finder](/work/london-property/report.html){:target="_blank" rel="noopener noreferrer"} · [try the single-property valuation tool](/work/london-property/estimate.html){:target="_blank" rel="noopener noreferrer"}
