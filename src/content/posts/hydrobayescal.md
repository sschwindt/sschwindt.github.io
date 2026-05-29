---
title: "HydroBayesCal: Bayesian Calibration as a Research Frontier in Hydrodynamic Modeling"
published: 2026-05-29
description: "How HydroBayesCal brings Bayesian Active Learning to hydrodynamic model calibration, with TELEMAC bindings (Andres Heredia) and OpenFOAM bindings (Federica Scolari) being developed at the IWS hydro-morphodynamics group."
cover: "/assets/images/hydrobayescal-wide.jpg"
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

Hydrodynamic simulations with TELEMAC, OpenFOAM, and their kin are key elements of contemporary river engineering and ecohydraulics. They are also, frankly, hungry: every simulation depends on bulky simplifications, such as roughness, turbulence, or sediment-transport models whose "true" values we can hardly observe directly. This is why we depend on model calibration, which practically is implemented through sweeping a parameter, eyeballing a fit, repeating; this practice is slow, undocumented, and gives poor answers to the question one eventually asks: *how confident are you in this parameter?*

This is where **Bayesian calibration** changes the game. Instead of returning a single "best" parameter set, it returns a posterior distribution: a full picture of which parameters are consistent with the data, how strongly they are constrained, and how they trade off against each other. The catch has always been cost. Tens of thousands of forward runs of a 2d/3d hydrodynamic solver is a nogo on any realistic project budget.

## HydroBayesCal

[**HydroBayesCal**](https://hydrobayescal.readthedocs.io/) is *a Bayesian calibration tool for hydrodynamic models*; we are building this framework in the hydro-morphodynamics group at [IWS at the University of Stuttgart](https://www.iws.uni-stuttgart.de) to make this tractable. The core idea is **Bayesian Active Learning (BAL)**: rather than blindly sampling the parameter space, we train a cheap surrogate (aka *metamodel*) of the solver, use Bayesian information criteria to decide *where the next expensive simulation will buy us the most information*, run only that one, update the surrogate, and iterate. The net effect is a posterior built from dozens, not thousands, of full physical runs.

What I find most exciting about this direction is that it shifts calibration from craft to quantified science. A posterior is something you can publish, propagate into design decisions, and compare across studies. It also opens the door to honest uncertainty bands on derived quantities like fish-passage performance, sediment fluxes, or wood-mobility thresholds -- the kind of outputs that decision-makers actually act on.

## Solver bindings: a community effort

A Bayesian framework is only useful when it can communicate with your solver. Two of our PhD candidates at IWS are pushing this forward in parallel:

- [**Andres Heredia**](https://www.iws.uni-stuttgart.de/en/institute/team/Heredia-Hidalgo/) is developing the **TELEMAC** bindings by automating run setup, restarts and result extraction for the open-source TELEMAC suite so that HydroBayesCal can iterate over hydrodynamic and morphodynamic configurations without manual intervention.
- [**Federica Scolari**](https://www.iws.uni-stuttgart.de/institut/team/Scolari/) is developing the **OpenFOAM** bindings to bring the same active-learning loop to general-purpose CFD, where 3d detail (free-surface flows, sediment–structure interaction, fishway hydraulics) matters.

Both software bindings share a common API on the HydroBayesCal side, which is the point: a user-facing workflow that doesn't change when you swap solvers.

## What's next

We are working on two fronts in parallel. First, **community release**, that is, improving the package, writing tutorials, and making sure that a graduate students and engineers outside our research environment can install HydroBayesCal, point it at a TELEMAC or OpenFOAM case, and get a defensible posterior in an afternoon. Second, **peer-reviewed papers**, that is, several manuscripts on the BAL method and on solver-specific bindings are in preparation, with case studies drawn from ongoing projects on ecohydraulic restoration, sediment dynamics, and fish-passage assessment.

If you are working on calibration of hydrodynamic, morphodynamic or sediment-transport models and would like to test-drive HydroBayesCal on your own case, please reach out: that is exactly the kind of external use case that helps us make the tool robust before the public release.

Read more: <https://hydrobayescal.readthedocs.io/>
