# Fomi Studio

### AI Content Generation Workspace

**A polished, responsive, and interactive AI creative workspace built with Next.js, React, JavaScript, and Tailwind CSS.**

**[Live Demo](https://fomi-studio-phi.vercel.app/)** · **[Source Code](https://github.com/Sharjeel234/fomi-creative-suite/tree/main/fomi-studio)** · **[Main Repository](https://github.com/Sharjeel234/fomi-creative-suite)**

---

## Overview

**Fomi Studio** is a responsive AI content-generation workspace developed for **Part A — Product Implementation** of the Fomi Frontend Developer Assessment.

The challenge required translating supplied mockup designs into a functional, visually polished frontend while demonstrating strong engineering fundamentals.

Fomi Studio focuses on delivering a premium creative experience through carefully structured layouts, reusable components, configurable generation controls, asynchronous UI states, and accessible interactions.

The application uses a mocked generation API to demonstrate the frontend workflow without requiring external AI services.

### Project Objectives

- Implement the supplied design with close attention to visual fidelity.
- Deliver an intuitive workspace across multiple screen sizes.
- Build reusable, maintainable React components.
- Demonstrate realistic asynchronous generation behavior.
- Provide meaningful feedback through loading, empty, and result states.
- Support accessible keyboard and modal interactions.
- Maintain a consistent, professional visual design system.

## Live Application

**Production URL:** https://fomi-studio-phi.vercel.app/

**GitHub:** https://github.com/Sharjeel234/fomi-creative-suite/tree/main/fomi-studio

## Features

### 1. Responsive Application Shell

Fomi Studio provides a structured application interface with:

- Sidebar navigation.
- Topbar.
- Main workspace content.
- Prompt and configuration sections.
- Results gallery.

The layout uses responsive composition to accommodate mobile, tablet, desktop, and larger screens.

### 2. Prompt Composer

The prompt composer allows users to enter descriptions of the visual content they want to generate.

It is integrated with the workspace generation handler and the selected generation settings.

The design emphasizes clarity and ease of use, keeping prompt entry central to the creative workflow.

### 3. Generation Settings

A dedicated configuration panel provides controls for adjusting generation parameters.

The implemented interface includes:

- Aspect-ratio selection.
- Custom aspect-ratio controls.
- State-driven configuration management.
- Disabled controls while a generation request is processing.

The selected settings are included in the request sent to the mocked API.

### 4. Mock Generation API

Fomi Studio uses a Next.js API route to simulate the generation process.

**Endpoint**

```http
POST /api/generate
```

**Illustrative request**

```json
{
  "mode": "image",
  "prompt": "Premium editorial skincare photography",
  "settings": {
    "aspectRatio": "4:5"
  }
}
```

**Illustrative response**

```json
{
  "success": true,
  "results": [
    {
      "id": "result-01",
      "imageUrl": "/images/demo-result.webp"
    }
  ]
}
```

The examples demonstrate the request/response concept. Exact result properties and paths are defined by the implementation.

The frontend validates the success flag and results array before updating the gallery.

**Important:** The generation API is mocked. It returns demonstration assets rather than creating new AI-generated media.

### 5. Results Gallery

The results gallery supports several interface states.

**Empty state**

Provides guidance before the user generates content.

**Loading state**

Displays skeleton placeholders while the generation request is in progress.

**Results state**

Displays returned images in a responsive card grid.

**Preview state**

Allows the user to inspect a selected image in an enlarged modal.

The gallery also communicates the number of returned results.

### 6. Accessible Image Preview

Generated images can be opened in an interactive preview dialog.

The implementation includes:

- Modal overlay.
- Enlarged image display.
- Close button.
- Escape-key handling.
- Keyboard focus trapping.
- Focus restoration after closing.
- Keyboard navigation considerations.

These details support a more polished and accessible interaction experience.

### 7. Error Handling

The generation workflow includes state for unsuccessful requests.

The frontend handles failed API responses and unexpected request errors without treating invalid responses as successful results.

### 8. Consistent Visual Design

The application uses a premium dark interface with violet accents and carefully differentiated surfaces.

The design emphasizes:

- Clear visual hierarchy.
- Consistent spacing.
- Readable typography.
- Subtle borders.
- Focus and hover states.
- Intentional use of accent colors.
- Minimal visual distraction.

## Design System

Fomi Studio uses reusable CSS design tokens.

### Color Palette

| Token | Hex |
|---|---|
| Background | `#101115` |
| Navigation | `#14151a` |
| Surface | `#191a20` |
| Raised Surface | `#202129` |
| Hover Surface | `#292a34` |
| Primary Text | `#f3f2f7` |
| Secondary Text | `#b9b6c9` |
| Muted Text | `#8b8799` |
| Border | `#2d2e39` |
| Strong Border | `#3a3b48` |
| Accent | `#b9a0ff` |
| Success | `#63d6a2` |
| Warning | `#ffc86b` |
| Error | `#ff6b6b` |

### Typography

- **Geist:** Primary interface typography.
- **Geist Mono:** Technical and numerical elements.

Fonts are integrated through `next/font/google`.

### Icons

The application uses **Lucide React** for consistent, lightweight interface iconography.

## Technology Stack

| Technology | Responsibility |
|---|---|
| Next.js App Router | Application routing and API endpoint |
| React | Component architecture and UI state |
| JavaScript | Application behavior |
| Tailwind CSS | Responsive interface styling |
| CSS Variables | Design tokens |
| Lucide React | Icons |
| Geist | Typography |
| Vercel | Deployment |

## Component Architecture

The application separates layout, generation logic, configuration, and result presentation into focused components.

### Core Components

**AppShell**

Defines the main application structure.

**Sidebar**

Provides workspace navigation.

**Topbar**

Displays the application header and associated controls.

**StudioWorkspace**

Coordinates the generation workflow, API requests, loading state, error state, and generated results.

**PromptComposer**

Handles prompt entry and generation-related controls.

**GenerationSettings**

Presents generation configuration options.

**ResultsGallery**

Displays empty, loading, and generated-results states.

**ImageCard**

Represents an individual generated result.

### Simplified Component Hierarchy

```text
AppShell
├── Sidebar
├── Topbar
└── StudioWorkspace
    ├── PromptComposer
    ├── GenerationSettings
    └── ResultsGallery
        └── ImageCard
```

## Generation Workflow

```text
Enter Prompt
     |
     v
Configure Settings
     |
     v
Click Generate
     |
     v
Set Loading State
     |
     v
POST /api/generate
     |
     v
Validate Response
     |
     v
Update Results
     |
     v
Display Gallery
     |
     v
Open Image Preview
```

### State Management

The workspace uses React state for:

- Generation settings.
- Generated results.
- Loading state.
- Error state.

The gallery independently manages selected-image preview behavior.

This separation keeps generation logic distinct from presentation-specific interactions.

## Getting Started

### Prerequisites

- A compatible Node.js version.
- npm.
- Git.

### Clone

```bash
git clone https://github.com/Sharjeel234/fomi-creative-suite.git

cd fomi-creative-suite/fomi-studio
```

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000.

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

### Linting

If the project defines a lint script:

```bash
npm run lint
```

No external AI credentials are needed for the mocked generation workflow.

## Responsive Design

The workspace is structured to adapt to different viewport sizes.

Key considerations include:

- Flexible content regions.
- Responsive grids.
- Reflowing configuration panels.
- Adaptive image-gallery columns.
- Consistent spacing.
- Touch-friendly interactive controls.

The goal is to preserve usability and visual hierarchy rather than simply scale down the desktop layout.

## Accessibility

Accessibility considerations include:

- Semantic elements.
- Keyboard-operable controls.
- Descriptive labels.
- Image alternative text.
- Visible focus states.
- Modal focus management.
- Escape-key dismissal.
- Focus restoration.
- Readable text contrast.

## Performance Considerations

The implementation emphasizes efficient frontend behavior through:

- Component-based rendering.
- Next.js font optimization.
- Responsive media presentation.
- Lightweight iconography.
- Asynchronous request handling.
- Loading placeholders.
- Avoiding unnecessary interface complexity.

No specific Lighthouse score is claimed without a reproducible measurement.

## Engineering Decisions

### Separation of Concerns

The workspace coordinates the generation process while individual components manage their own presentation responsibilities.

### Mock API Instead of Real AI Integration

A mocked API demonstrates frontend architecture and asynchronous interaction without introducing unrelated infrastructure complexity.

### Explicit UI States

Empty, loading, result, and error states help make the application predictable.

### Design Tokens

Centralized visual values improve consistency and maintainability.

### Accessible Modal Behavior

Keyboard support and focus management improve the experience beyond basic mouse-driven interaction.

## Testing and Verification

During development, the following behaviors were exercised:

- Application rendering.
- Sidebar and topbar integration.
- Design-token application.
- Mock API responses.
- Generation requests.
- Image result rendering.
- Loading states.
- Preview dialog behavior.

A final deployment audit should additionally verify responsive layouts, performance, and complete API mode coverage.

## Known Limitations

Fomi Studio is an assessment implementation, not a production AI service.

- Generation uses demonstration assets.
- Real AI model inference is not integrated.
- Generated content is not persisted to a database.
- Authentication and account management are outside scope.
- Video-result support requires final verification against the assessment's image-and-video mock API requirement.

## Future Enhancements

- Real image-generation service integration.
- Complete video-generation workflow.
- Saved generation history.
- Persistent projects.
- Additional creative presets.
- Image editing and enhancement.
- Automated end-to-end testing.
- Further accessibility and performance improvements.

## Assessment Context

**Fomi Frontend Developer Assessment — Part A**

The project demonstrates the ability to translate design mockups into a responsive, interactive, maintainable frontend.

The implementation focuses on the assessment's core criteria:

- Visual fidelity.
- Interaction design.
- Responsiveness.
- Component architecture.
- Code quality.
- Accessibility.
- Performance.
- Attention to detail.

## Related Project

Explore **Fomi Canvas**, the independent Part B product-thinking implementation.

**[Fomi Canvas — Live Demo](https://fomi-canvas.vercel.app/)**

**[Fomi Canvas — Documentation](../fomi-canvas/README.md)**

## Author

**Sharjeel Mansoor**

Frontend / Full-Stack Developer

[GitHub](https://github.com/Sharjeel234)

---

**Disclaimer:** This project was independently developed for the Fomi Frontend Developer Assessment and is not an official Fomi production application.