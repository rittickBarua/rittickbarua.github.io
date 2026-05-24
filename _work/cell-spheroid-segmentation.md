---
title: "Cell-spheroid segmentation for high-throughput microscopy"
collection: work
weight: 2
permalink: /work/cell-spheroid-segmentation/
date: 2025-01-01
tagline: "Deep-learning computer vision · U-Net, PyTorch · clinical research"
description: "A plain U-Net deep-learning model that segments tumour cell spheroids in high-throughput microscopy, reaching a validation IoU of 0.968 and Dice of 0.983."
excerpt: "A plain U-Net segmentation model for high-throughput cell-spheroid microscopy, built as research engineering for a surgical-biotechnology group, reaching a validation intersection-over-union of 0.968 and Dice coefficient of 0.983."
---

**Role:** Research engineering. **Context:** UCL, Royal Free Hospital, Department of Surgical Biotechnology.

A deep-learning pipeline that segments tumour cell spheroids in high-throughput brightfield microscopy, built to automate and de-bias cancer-cell image analysis for a surgical-biotechnology research group.

## The problem

Quantifying spheroid growth and drug response across large microscopy plates depends on cleanly delineating each spheroid from its background. Done by hand, that delineation is slow and varies between operators, which is the kind of subjective bottleneck that limits both throughput and reproducibility in a research setting.

## Approach

- **Model.** A plain U-Net encoder-decoder convolutional network (≈13.4 million parameters, PyTorch) trained on 128×128 image tiles to produce per-pixel spheroid masks. The headline metrics below come from this model. An Attention U-Net trainer also lives in the repository as an alternative, but it is not the production model.
- **Data.** Brightfield microscopy of breast-cancer cell lines (MCF-7, SK-BR-3, MDA-MB-231 and MDA-MB-453), imaged across a multi-day time course at a range of seeding densities under collagen and control conditions. Several hundred annotated image-mask pairs, split into train, validation and test sets with automated data-integrity checks for mismatched stems, missing masks and bad file extensions.
- **Baselines.** Before committing to a learned model, I benchmarked classical segmentation methods (Otsu thresholding, watershed, k-means, active contours and region growing) to establish where a CNN genuinely earns its place over simpler, cheaper methods.

## Result

The plain U-Net reached a validation **intersection-over-union of 0.968** and a **Dice coefficient of 0.983**, a clear step change over the classical baselines and consistent enough to drop into a high-throughput analysis workflow.

**Stack:** PyTorch, U-Net, OpenCV, scikit-image, Python. Source code is in a private repository, available on request.
