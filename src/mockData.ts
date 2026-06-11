import { AISummary } from "./types";

export const INITIAL_EXAMPLE_SUMMARIES: AISummary[] = [
  {
    summaryId: "example-alphafold3",
    userId: "mock-user-id",
    title: "DeepMind AlphaFold 3 Architecture & Capabilities",
    originalText: "DeepMind AlphaFold 3 is a revolutionary AI model that predicts the 3D structures and interactions of all life's molecules with unprecedented accuracy. Developed as a successor to AlphaFold 2, it introduces severe architectural enhancements, especially the replacement of the Invariant Point Attention (IPA) module with a diffusion-based structural generator layer. This diffusion framework allows it to model not only proteins, but also DNA, RNA, chemical compounds (ligands), ions, and chemical modifications. It represents a paradigm shift in structural biology and drug discovery, significantly reducing workflow times from months to seconds.",
    fileType: "manual",
    shortSummary: "AlphaFold 3 predicts the 3D structure and complex interactions of proteins, DNA, RNA, and chemical ligands with extreme accuracy. It replaces its previous structural attention layers with a flexible diffusion generator. This paradigm shift accelerates structural biochemistry and molecular drug discovery from months of wet-lab pipetting into seconds of cloud compute.",
    detailedSummary: `## Introduction to AlphaFold 3
Google DeepMind's AlphaFold 3 models molecular complexes containing proteins, nucleic acids, and small molecule links.

## Core Architectural Upgrades
1. **Diffusion-Based Structural Generator**: Unlike AlphaFold 2 which relied on complex, specialized structural constraints like Invariant Point Attention, AlphaFold 3 operates as a generative diffusion model. It begins with randomized atom clouds and sequentially de-noises coordinates.
2. **Simplified Representation**: Operates with unified atomic positions, improving speed and multi-entity compatibility.
3. **Enhanced Multi-Chain Modeling**: Predicts physical interfaces between proteins, ligands, and nucleic targets like RNA and DNA.

## Real World Breakthroughs
- **Drug Design Pipelines**: Simulates receptor-ligand docking with extreme fidelity.
- **Genetic Studies**: Maps transcriptional regulatory systems through precise DNA-protein assembly.`,
    language: "en",
    category: "Medicine",
    sentiment: "Analytical",
    difficulty: "hard",
    readingTime: 4.5,
    explainLikeIm5: "Imagine having a magical Lego assistant. Instead of spending months trying to figure out how tiny puzzle pieces inside biological cells fit together, this assistant looks at a list of ingredients and instantly builds a perfect 3D toy set of the cell assembly in seconds!",
    keyPoints: [
      "AlphaFold 3 models the complex structures of proteins, DNA, RNA, ligands, and chemical modifications.",
      "Replaces the previous version's structural attention with a coordinate-denoising diffusion generator.",
      "Bypasses traditional specialized layers, handling joint molecular environments uniformly.",
      "Drastically accelerates pharmaceutical screening, biological pathway studies, and clinical designs."
    ],
    actionItems: [
      "Review the official research paper in Nature regarding AlphaFold 3.",
      "Test molecular configurations inside DeepMind's web platform.",
      "Evaluate diffusion model outputs against traditional cryogenic electron microscopy (Cryo-EM) datasets."
    ],
    studyNotes: `# AlphaFold 3 Examination Study Kit

## Key Terms for Revision
- **Diffusion Generator**: Generative model that constructs precise 3D atomic coordinates from random noise.
- **Ligand**: A molecule that binds to another chemical entity, crucial for understanding therapeutic drugs.
- **Cryo-EM**: High-resolution microscopy used to validate predicted molecular structures.

## Core Themes
1. Contrast AlphaFold 2 (highly constrained representation) vs. AlphaFold 3 (diffusion coordinate modeling).
2. Learn the implications of general molecular predictions on chemical pharmacology and therapeutic discovery.`,
    questions: [
      {
        question: "Which module replaces the Invariant Point Attention (IPA) in AlphaFold 3?",
        options: [
          "Recurrent Transformer Cells",
          "Diffusion structural generator",
          "Feed Forward Dense layers",
          "Liquid State Convolutional neural network"
        ],
        answerIndex: 1,
        explanation: "AlphaFold 3 replaces the IPA and specialized structural components from AlphaFold 2 with a specialized coordinates-denoising generative diffusion layer."
      },
      {
        question: "What is the primary benefit of AlphaFold 3 over AlphaFold 2?",
        options: [
          "It predictions are fully decentralized",
          "It only uses 10% of training memory",
          "It models joint interactions of DNA, RNA, ligating compounds, and proteins",
          "It works without any amino acid inputs"
        ],
        answerIndex: 2,
        explanation: "AlphaFold 2 focused mostly on isolated protein chains. AlphaFold 3 models the multi-molecular universe including proteins, nucleic acids, ions, and chemical ligand complexes jointly."
      }
    ],
    flashcards: [
      {
        front: "What is a ligand?",
        back: "A small molecule that binds to a larger protein, often representing a pharmaceutical drug."
      },
      {
        front: "Diffusion Coordinates",
        back: "AlphaFold 3's atomic coordinate mapping approach, commencing with noisy scatter clouds and polishing."
      }
    ],
    mindMap: {
      name: "AlphaFold 3 Model",
      children: [
        {
          name: "Core Upgrades",
          children: [
            { name: "Generative Diffusion" },
            { name: "Joint Multi-Chain Docking" }
          ]
        },
        {
          name: "Molecule Targets",
          children: [
            { name: "Proteins & Enzymes" },
            { name: "DNA & RNA Strands" },
            { name: "Chemical Ligands" }
          ]
        }
      ]
    },
    keywords: ["AlphaFold3", "DeepMind", "MolecularModeling", "Diffusion", "DrugDiscovery", "Biochemistry"],
    importantDatesNumbersFullList: [
      "AlphaFold 3 release (2024)",
      "Reduces structural resolution workflows from months to seconds"
    ],
    isBookmarked: true,
    createdAt: "2026-06-11T09:12:00.000Z",
    wordCount: 92,
    charCount: 618
  },
  {
    summaryId: "example-q3sync",
    userId: "mock-user-id",
    title: "Q3 Engineering Sync & Roadmap Alignment",
    originalText: "The Q3 Engineering aligning session focused on product deliverables, QA timelines, and server maintenance schedules. Sarah reviewed the QA bottleneck, proposing revised timelines by June 24. We must implement Vite-level optimizations for client performance. Service APIs should bind uniquely to port 3000 under sandboxed containers. Alex is assigned to configure Firestore security rule bundles before deploying the active database schema in production. Weekly standups will monitor stakeholder feedback.",
    fileType: "manual",
    shortSummary: "Engineering leaders aligned on Q3 roadmap deliverables, highlighting server port allocations and critical security rule deployments. QA bottlenecks are addressed with new milestone timelines scheduled for June 24. Actions include Firestore configurations and Vite performance reviews in weekly sprints.",
    detailedSummary: `## Q3 Roadmaps Sync Highlights
Summary of alignment milestones discussed during our engineering sync.

## Strategic Milestones
- **QA Pipeline Speedups**: Sarah highlighted bottlenecks. Timelines are shifted out to **June 24** to preserve quality metrics.
- **Port Allocation**: Server builds must run exclusively under internal container port **3000** for ingress proxies.
- **Firestore Hardening**: Alex to deploy strict permission checks before producing schema updates.`,
    language: "en",
    category: "Meetings",
    sentiment: "Analytical",
    difficulty: "medium",
    readingTime: 2.0,
    explainLikeIm5: "Our tech team got together on a call to plan our goals! We decided Sarah will supervise test speeds and Alex will construct strong lock-and-key safety locks around our database so hackers cannot peek at files.",
    keyPoints: [
      "Milestone deadlines for QA bottleneck resolutions are rescheduled to June 24.",
      "Dev configurations must bind local server containers strictly onto port 3000.",
      "Database schemas are restricted under secure rules checking authenticated read/writes."
    ],
    actionItems: [
      "Sarah: Propose finalized QA workflow timelines. Done: June 24.",
      "Alex: Harden and write Firestore draft security rules.",
      "Product team: Review client-side performance under Vite settings."
    ],
    studyNotes: `# Q3 Project Alignment Core Checklists

## Actionable Deliverables
- Port mapping verification (Must use 3000).
- Firestore rule deployment schedules (Alex).
- June 24 QA milestones deadline (Sarah).`,
    questions: [
      {
        question: "When is Sarah scheduled to propose the revised QA milestones?",
        options: ["June 10", "June 24", "July 15", "August 1"],
        answerIndex: 1,
        explanation: "The meeting highlights explicitly set the QA pipeline bottleneck revision milestone timeline as June 24."
      }
    ],
    flashcards: [
      {
        front: "Server ingress Port",
        back: "Port 3000, designated uniquely by reverse proxy environments."
      }
    ],
    mindMap: {
      name: "Q3 Roadmap Align",
      children: [
        {
          name: "Engineering Sprints",
          children: [
            { name: "Port 3000 servers validation" },
            { name: "Vite layout tuning" }
          ]
        },
        {
          name: "Schedules",
          children: [
            { name: "Sarah: QA june 24" },
            { name: "Alex: Firestore locks" }
          ]
        }
      ]
    },
    keywords: ["Q3Roadmap", "EngineeringSync", "ProductDeployments", "FirestoreLocks", "Port3000"],
    importantDatesNumbersFullList: [
      "QA milestone deadline target: June 24",
      "Network listening port: 3000"
    ],
    isBookmarked: false,
    createdAt: "2026-06-11T08:30:00.000Z",
    wordCount: 74,
    charCount: 494
  }
];
