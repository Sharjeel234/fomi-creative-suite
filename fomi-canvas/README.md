# Fomi Canvas

### Explore Ideas. Branch Possibilities. Preserve Creative Thinking.

**A spatial AI creative workspace designed to make visual exploration, iteration, and decision-making more intuitive for professional creators.**

**[Live Demo](https://fomi-canvas.vercel.app/)** · **[Source Code](https://github.com/Sharjeel234/fomi-creative-suite/tree/main/fomi-canvas)** · **[Main Repository](https://github.com/Sharjeel234/fomi-creative-suite)**

---

## Overview

**Fomi Canvas** is an experimental, professional AI image-generation workspace created for **Part B — Product Thinking Challenge** of the Fomi Frontend Developer Assessment.

The project reimagines AI creative workflows around a central idea:

> Creative exploration should preserve the relationships between ideas, not just the final images.

Traditional generation interfaces often organize outputs into galleries or chronological histories.

While useful for producing individual results, these approaches can make it difficult to understand how a creative direction evolved, which variations came from which ideas, and why certain decisions were made.

Fomi Canvas explores an alternative: a connected, spatial workspace where creative concepts form a visual history of exploration.

Instead of replacing previous results, creators can branch from existing concepts, inspect their lineage, and compare alternative directions.

## Live Application

**Production URL:** https://fomi-canvas.vercel.app/

**Source Code:** https://github.com/Sharjeel234/fomi-creative-suite/tree/main/fomi-canvas

## The Problem

Professional creators rarely arrive at the best result on their first attempt.

Creative work involves repeated experimentation:

- Exploring multiple visual directions.
- Refining prompts.
- Adjusting generation settings.
- Revisiting earlier concepts.
- Comparing alternative results.
- Understanding which decisions produced stronger outcomes.

In a conventional linear generation workflow, these relationships can become difficult to track.

Fomi Canvas is designed to make creative exploration more structured without forcing creators into a complicated project-management interface.

## Target Users

The workspace is designed for returning professional users who spend substantial time creating and refining visual content.

Examples include:

- Creative directors.
- Designers.
- Brand and marketing teams.
- Digital artists.
- Content creators.
- Visual storytellers.

The interface assumes the user is already working inside an existing creative project rather than visiting a marketing homepage.

## Product Vision

### From Generation History to Creative Lineage

Fomi Canvas treats generated concepts as connected creative decisions.

Each concept can become a starting point for further exploration.

New variations retain a relationship with their source, helping creators understand how the project evolved.

The goal is not to replace AI generation with a complicated node editor.

The goal is to make iteration, comparison, and creative decision-making feel natural.

## Core Workflow

**Explore → Branch → Trace → Compare → Refine**

### Explore

Navigate a visual workspace containing creative concepts.

### Branch

Create a new direction from an existing concept.

### Trace

Understand how concepts relate to their predecessors.

### Compare

Evaluate alternative directions side by side.

### Refine

Continue exploration from the most promising concept.

This workflow is the central product idea behind Fomi Canvas.

## Features

### 1. Interactive Spatial Canvas

Fomi Canvas provides a visual workspace for exploring connected creative concepts.

The canvas supports:

- Panning.
- Zooming.
- Fit View.
- Concept selection.
- Concept focus.
- Spatial navigation.

The canvas provides context beyond a conventional image gallery by showing relationships between visual ideas.

### 2. Concept Nodes

Each concept is represented by an interactive visual node.

Nodes are used to present individual creative results within the workspace.

The component architecture separates node presentation from the broader canvas navigation and graph relationships.

### 3. Parent-Child Connections

Visual connections communicate relationships between concepts.

These connections help users identify which ideas originated from earlier creative directions.

The graph structure supports a branching workflow rather than a purely chronological result list.

### 4. Branch Generation

Users can create a simulated variation from an existing concept.

The branching interaction includes:

- Source concept selection.
- Branch-generation dialog.
- Contextual generation configuration.
- Prompt and settings inheritance.
- Creation of a related concept node.
- Updated graph relationships.

**Important:** Branch generation is simulated. The implementation demonstrates the workflow and graph updates using local data and demonstration imagery.

### 5. Creative Lineage

Fomi Canvas allows creators to inspect the evolution of a selected concept.

Lineage functionality includes:

- Parent-child relationships.
- Ancestor navigation.
- Breadcrumb-style history.
- Branch history.
- Related concept navigation.
- Branch statistics.

These features make it easier to return to earlier creative decisions without losing the context of later iterations.

### 6. Concept Comparison

The comparison workflow allows users to evaluate two creative concepts side by side.

The interface includes:

- Comparison selection controls.
- Side-by-side concept presentation.
- Generation-settings differences.
- Contextual comparison details.
- Accessible comparison dialog.

This workflow helps creators assess creative alternatives without repeatedly switching between individual previews.

### 7. Responsive Workspace

The interface is designed to support different viewport sizes.

Responsive behavior adapts the canvas and surrounding controls to maintain usability on smaller screens.

The implementation prioritizes the creative workspace while keeping supporting actions accessible.

### 8. Accessible Interactions

The application incorporates accessibility considerations such as:

- Keyboard-operable controls.
- Focus management.
- Escape-key handling.
- Accessible dialogs.
- Descriptive interface labels.
- Visible interaction states.
- Responsive control placement.

### 9. Performance-Aware Media

Concept imagery uses Next.js image capabilities.

The node implementation supports:

- Eager loading for prioritized imagery.
- Lazy loading for non-priority imagery.
- Fetch-priority hints.
- Asynchronous image decoding.

These decisions help prioritize visually important content.

## Three Key UX Decisions

### 1. A Spatial Workspace Instead of a Linear Gallery

**Decision:** Organize concepts in a connected visual canvas.

**Why:** Professional creative exploration involves multiple directions, not just a sequence of outputs.

The spatial approach makes relationships visible and supports non-linear exploration.

**Trade-off:** Spatial interfaces introduce navigation complexity, so pan, zoom, Fit View, and focus controls are important.

### 2. Branching With Context Inheritance

**Decision:** Allow creators to branch from an existing concept while preserving relevant prompt and configuration context.

**Why:** Creators should not need to reconstruct previous settings each time they explore a variation.

**Trade-off:** The implementation focuses on understandable branching rather than exposing a large collection of advanced generation controls.

### 3. Integrated Lineage and Comparison

**Decision:** Keep creative history and concept comparison inside the same workspace.

**Why:** The value of a creative concept depends partly on how it evolved and how it compares with alternatives.

**Trade-off:** Collaboration, advanced editing, and persistent storage were intentionally left outside the prototype scope.

## What Makes Fomi Canvas Different?

### Branch → Trace → Compare

The project's primary differentiating workflow is the combination of:

**Branching**

Explore new directions from an existing visual concept.

**Tracing**

Understand the relationships and history behind a result.

**Comparing**

Evaluate creative alternatives without losing their context.

These capabilities are not individually exclusive to Fomi Canvas. The product concept focuses on bringing them together into one coherent creative workflow.

## Product Inspiration

Fomi Canvas draws inspiration from several categories of creative software.

### Figma

**Inspiration:** Spatial navigation, canvas-oriented workflows, and professional creative tools.

**Adaptation:** Apply spatial interaction to AI-generated concepts and their relationships.

### Pinterest

**Inspiration:** Visual exploration and rapid discovery.

**Adaptation:** Preserve the ease of browsing visual ideas while adding explicit creative lineage.

### Cursor

**Inspiration:** Context-aware workflows that reduce repeated setup and support iterative work.

**Adaptation:** Carry prompt and settings context forward when branching from a concept.

### AI Creative Platforms

Products such as Krea, Leonardo.ai, and Higgsfield demonstrate the value of accessible, powerful AI generation interfaces.

Fomi Canvas explores a different emphasis: preserving and navigating the decision-making process between generations.

These products are inspirations rather than interfaces being reproduced.

## Intentional Scope Decisions

The prototype deliberately avoids implementing every possible AI creative feature.

### Live AI Inference

Excluded to keep the assessment focused on frontend engineering and product thinking.

### Advanced Image Editing

Excluded to avoid turning the workspace into a full image-editing suite.

### Real-Time Collaboration

Excluded because collaborative permissions, synchronization, and conflict resolution would significantly expand the implementation scope.

### Persistent Cloud Storage

Excluded in favor of demonstrating the core branching and comparison workflows through local application state.

### Complex Model Configuration

Limited to the configuration needed to demonstrate the concept without overwhelming the workspace.

These decisions reflect the principle:

> Maximum capability. Minimum complexity.

## Technology Stack

| Technology | Responsibility |
|---|---|
| Next.js App Router | Application framework |
| React | UI composition and state |
| JavaScript | Application and graph logic |
| Tailwind CSS | Responsive styling |
| CSS Custom Properties | Design consistency |
| Lucide React | Iconography |
| Next.js Image | Media optimization |
| Vercel | Deployment |

## Application Architecture

The implementation separates canvas rendering, graph behavior, branching, lineage, and comparison into focused modules.

### Core Components

**CanvasShell**

Provides the main workspace structure.

**CanvasBoard**

Coordinates the visual canvas and concept presentation.

**ConceptNode**

Renders individual visual concepts.

**BranchConnections**

Displays parent-child relationships.

**CanvasToolbar**

Provides navigation and viewport controls.

**BranchGenerationModal**

Supports the simulated branching workflow.

**LineageBreadcrumbs**

Displays concept ancestry and navigation.

**NodeNavigationControls**

Supports movement between related concepts.

**BranchHistoryPanel**

Presents branching history and related information.

**ComparisonControls**

Provides concept comparison actions.

**ComparisonModal**

Displays side-by-side concepts and their differences.

### Supporting Logic

The application also separates reusable behavior into utilities and hooks.

**Canvas utilities**

Handle canvas-related calculations and operations.

**Branch utilities**

Support concept branching and graph relationships.

**Lineage utilities**

Support ancestor and history traversal.

**Comparison utilities**

Support comparison-related data processing.

**Comparison hook**

Encapsulates comparison interaction state.

**Initial project data**

Provides the demonstration concepts used by the workspace.

### Simplified Architecture

```text
Fomi Canvas
│
├── Workspace Shell
│
├── Spatial Canvas
│   ├── Concept Nodes
│   ├── Branch Connections
│   └── Viewport Controls
│
├── Branching Workflow
│   ├── Generation Modal
│   └── Branch Utilities
│
├── Creative Lineage
│   ├── Breadcrumbs
│   ├── History Panel
│   └── Navigation Controls
│
├── Concept Comparison
│   ├── Comparison Controls
│   ├── Comparison Modal
│   └── Comparison Utilities
│
└── Initial Project Data
```

## Getting Started

### Prerequisites

- A compatible Node.js version.
- npm.
- Git.

### Clone the Repository

```bash
git clone https://github.com/Sharjeel234/fomi-creative-suite.git

cd fomi-creative-suite/fomi-canvas
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Linting

If the project defines a lint script:

```bash
npm run lint
```

The demonstration workflow does not require external AI credentials.

## How to Use

### Navigate the Canvas

Pan and zoom to explore the concept graph.

Use Fit View to return to a useful overview of the workspace.

### Select a Concept

Choose a concept node to focus on a particular creative direction.

### Generate a Branch

Open the branching interaction from a concept.

Review the inherited context, adjust available settings, and create a simulated variation.

### Explore Lineage

Use breadcrumbs, history, and navigation controls to understand how a concept evolved.

### Compare Concepts

Select two concepts for comparison.

Open the comparison view to inspect their visuals and relevant configuration differences.

### Continue Exploring

Return to the canvas and branch from another promising concept.

## Testing and Quality Assurance

Fomi Canvas was developed and reviewed through incremental implementation and manual testing.

The reported manual QA review covered:

| Category | Checks |
|---|---:|
| Canvas interactions | 7 |
| Branch generation | 10 |
| Lineage | 12 |
| Comparison | 14 |
| Responsive and accessibility | 16 |
| Reliability and performance | 10 |
| **Total** | **69** |

All 69 manual checks were reported as passing during development.

The final cleanup review also covered linting, production build, repository hygiene, environment-file protection, metadata, and assessment scope.

These are development QA results, not a substitute for automated browser tests or independently reproduced production benchmarks.

## Performance Considerations

The implementation includes performance-oriented decisions such as:

- Optimized image rendering.
- Lazy loading for non-priority concept images.
- Prioritized loading for important visuals.
- Separation of reusable graph logic.
- Focused React component responsibilities.
- Avoiding unnecessary interface complexity.

Future optimization should consider larger graph sizes and more extensive automated profiling.

## Accessibility Considerations

The workspace includes:

- Keyboard-operable interactions.
- Focus-managed dialogs.
- Escape-key support.
- Clear control labeling.
- Visible focus indicators.
- Responsive navigation.
- Meaningful image descriptions.

The goal is to make complex creative interactions approachable without relying exclusively on pointer-based input.

## Known Limitations

Fomi Canvas is a frontend product prototype.

- AI generation is simulated.
- Demonstration assets are used for visual results.
- New branches are managed in client-side state.
- Project changes are not persisted to a backend.
- Collaboration is not implemented.
- Advanced image editing is outside scope.
- The application is not a production AI-generation service.

## Future Roadmap

With an additional month of development, priorities would include:

### 1. Persistent Projects

Save concepts, branches, settings, and project history.

### 2. Undo and Redo

Support safer exploration and recovery from unintended changes.

### 3. Real AI Generation

Connect the branching workflow to actual image-generation services.

### 4. Large-Graph Optimization

Improve viewport performance and node rendering for projects containing hundreds of concepts.

### 5. Better Creative Comparison

Expand comparison capabilities with additional visual and metadata inspection tools.

### 6. Automated Testing

Add component, integration, and end-to-end coverage for core creative workflows.

## Assessment Context

**Fomi Frontend Developer Assessment — Part B: Product Thinking Challenge**

The optional challenge asked for an original, professional creative workspace that demonstrates product thinking alongside frontend engineering.

Fomi Canvas was designed around the **Image Generation Workspace** option.

The project emphasizes:

- Original creative direction.
- Professional workflow design.
- Information hierarchy.
- Interaction quality.
- Reusable architecture.
- Accessibility.
- Responsive behavior.
- Performance awareness.
- Intentional feature prioritization.

## Related Project

**Fomi Studio — Part A**

A responsive AI content-generation workspace implementing the provided assessment mockup.

**[Live Demo](https://fomi-studio-phi.vercel.app/)**

**[Documentation](../fomi-studio/README.md)**

## Author

**Sharjeel Mansoor**

Frontend / Full-Stack Developer

[GitHub](https://github.com/Sharjeel234)

---

**Disclaimer:** Fomi Canvas was independently designed and developed as a frontend assessment prototype. It is not an official production release of Fomi.

**Fomi Canvas — Because the journey from one idea to the next matters as much as the final result.**