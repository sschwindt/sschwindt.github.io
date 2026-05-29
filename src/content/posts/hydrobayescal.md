---
title: "HydroBayesCal: Bayesian Calibration as a Research Frontier in Hydrodynamic Modelling"
published: 2026-05-29
description: "How HydroBayesCal brings Bayesian Active Learning to hydrodynamic model calibration, with TELEMAC bindings (Andres Heredia) and OpenFOAM bindings (Federica Scolari) being developed at the IWS hydro-morphodynamics group."
cover: "/assets/images/isar-ftir.jpg"
tags:
    - Bayesian calibration
    - Bayesian Active Learning
    - HydroBayesCal
    - TELEMAC
    - OpenFOAM
    - hydrodynamic modelling
    - uncertainty quantification
    - ecohydraulics
category: "Research"
draft: false
lang: ""
---

Hydrodynamic models — TELEMAC, OpenFOAM, and their kin — are the workhorses of modern river engineering and ecohydraulics. They are also, frankly, hungry: every simulation depends on roughness coefficients, turbulence parameters, sediment-transport closures and boundary inflows whose "true" values we never observe directly. Traditional calibration — sweep a parameter, eyeball a fit, repeat — is slow, undocumented, and gives no honest answer to the question every reviewer eventually asks: *how confident are you in this parameter?*

This is where **Bayesian calibration** changes the game. Instead of returning a single "best" parameter set, it returns a posterior distribution: a full picture of which parameters are consistent with the data, how strongly they are constrained, and how they trade off against each other. The catch has always been cost. Tens of thousands of forward runs of a 2D/3D hydrodynamic solver is a non-starter on any realistic project budget.

## HydroBayesCal

[**HydroBayesCal**](https://hydrobayescal.readthedocs.io/) — *a Bayesian calibration tool for hydrodynamic models* — is the framework we are building in the hydro-morphodynamics group to make this tractable. The core idea is **Bayesian Active Learning (BAL)**: rather than blindly sampling the parameter space, we train a cheap surrogate of the solver, use Bayesian information criteria to decide *where the next expensive simulation will buy us the most information*, run only that one, update the surrogate, and iterate. The net effect is a posterior built from dozens — not thousands — of full physical runs.

What I find most exciting about this direction is that it shifts calibration from craft to *quantified science*. A posterior is something you can publish, propagate into design decisions, and compare across studies. It also opens the door to honest uncertainty bands on derived quantities like fish-passage performance, sediment fluxes, or wood-mobility thresholds — the kind of outputs that decision-makers actually act on.

## Solver bindings: a community effort

A Bayesian framework is only useful when it can drive *your* solver. Two of my PhD candidates are pushing this forward in parallel:

- [**Andres Heredia**](https://www.iws.uni-stuttgart.de/en/institute/team/Heredia-Hidalgo/) is developing the **TELEMAC** bindings — automating run setup, restarts and result extraction for the open-source TELEMAC-MASCARET suite so that HydroBayesCal can iterate over hydrodynamic and morphodynamic configurations without manual intervention.
- [**Federica Scolari**](https://www.iws.uni-stuttgart.de/institut/team/Scolari/) is developing the **OpenFOAM** bindings — bringing the same active-learning loop to general-purpose CFD, where 3D detail (free-surface flows, sediment–structure interaction, fishway hydraulics) matters.

Both threads share a common API on the HydroBayesCal side, which is the point: a user-facing workflow that doesn't change when you swap solvers.

## What's next

We are working on two fronts in parallel. First, **community release** — hardening the package, writing tutorials, and making sure that a graduate student outside Stuttgart can install HydroBayesCal, point it at a TELEMAC or OpenFOAM case, and get a defensible posterior in an afternoon. Second, **peer-reviewed papers** — separate manuscripts on the BAL methodology and on each solver-specific binding are in preparation, with case studies drawn from ongoing projects on ecohydraulic restoration, sediment dynamics and fish-passage assessment.

If you are working on calibration of hydrodynamic, morphodynamic or sediment-transport models and would like to test-drive HydroBayesCal on your own case, please reach out — that is exactly the kind of external use case that helps us make the tool robust before the public release.

→ Documentation: <https://hydrobayescal.readthedocs.io/>
