/**
 * SOTA REFERENCES DATABASE & SYNTHETIC DATA SEED LIBRARY
 * 
 * SYSTEM-WIDE OPERATIONAL RULE:
 * This library serves as the ultimate semantic grounding resource for the Agnostic Product Graph.
 * If any operational node/edge lacks real data, automated content, or live user feedback,
 * near-real functional synthetic data must be generated using these references as structural seeds.
 * 
 * TEMPORARY BRIDGE CLAUSE:
 * Synthetic data is a temporary bootstrapping measure. All synthetic nodes must:
 * 1. Set dataOriginSource to "Synthetic (Temporary Bridge)"
 * 2. Fire proactive alerts/reminders in the workspace UI so they are not forgotten.
 * 3. Be gradually replaced with real-world inputs, schedules, or direct feedback.
 * 
 * REFERENCE CURRENCY & AUDITING:
 * Ensure all 20 reference slots are highly active and relevant to the active Media_Category.
 * This library must be updated periodically under Omar's permission to prevent stagnation.
 * 
 * PROMPT-TO-ML TRANSITION ARCHITECTURE:
 * 1. Maintain robust, high-performance Prompt templates corresponding to each strategic and operational node.
 * 2. Ensure prompt templates are strictly validated and output predictable structured JSON.
 * 3. Support gradual replacement of these nodes with specialized local ML models as the pipeline matures, keeping schemas identical.
 * 
 * MATHEMATICAL & STATISTICAL PROGRESSION PROTOCOL:
 * 1. Initialize mathematical calculations using simple, readable, functional formulas (e.g., simple averages, standard deviations).
 * 2. Support modular upgrading of nodes to SOTA algorithms (e.g., Cosine Similarity, Bayesian updates, multi-dimensional covariance matrix) on demand.
 * 3. Keep data schemas backwards-compatible with both simple scalar scores and complex vector embeddings.
 */

export interface ReferenceDoc {
  id: string;
  category: string;
  title: string;
  focusArea: string;
  mediaCategory: string;
  url: string;
}

export const REFERENCES_DATABASE: ReferenceDoc[] = [
  {
    id: "R1",
    category: "Foundational",
    title: "The Mom Test",
    focusArea: "Problem Validation",
    mediaCategory: "General",
    url: "https://www.simonandschuster.co.uk/books/The-Mom-Test/Rob-Fitzpatrick/9798893312560"
  },
  {
    id: "R2",
    category: "Foundational",
    title: "Jobs to be Done (JTBD) Framework",
    focusArea: "Outcome Orientation",
    mediaCategory: "General",
    url: "https://www.suebehaviouraldesign.com/en/blog/jobs-to-be-done-explained/"
  },
  {
    id: "R3",
    category: "Foundational",
    title: "Problem/Solution Fit",
    focusArea: "Lean Startup Methodology",
    mediaCategory: "General",
    url: "https://en.wikipedia.org/wiki/Lean_startup"
  },
  {
    id: "R4",
    category: "Foundational",
    title: "Design Thinking Empathy Mapping",
    focusArea: "User/Persona Focus",
    mediaCategory: "General",
    url: "https://www.parallelhq.com/blog/how-to-create-an-empathy-map"
  },
  {
    id: "R5",
    category: "Foundational",
    title: "MECE Principle",
    focusArea: "Logical Structure",
    mediaCategory: "General",
    url: "https://en.wikipedia.org/wiki/MECE_principle"
  },
  {
    id: "R6",
    category: "Lean + AI PM",
    title: "AI/Lean Startup Method & Product Innovations",
    focusArea: "Innovation Mapping",
    mediaCategory: "General",
    url: "https://www.powersystemsdesign.com/articles/innovation-through-lean-ai/22/23665"
  },
  {
    id: "R7",
    category: "Lean + AI PM",
    title: "Lean Product Strategies for Startups 2026",
    focusArea: "Closed-loop Development",
    mediaCategory: "General",
    url: "https://www.lean.org/the-lean-post/articles/past-present-and-future-of-lean-and-ai/"
  },
  {
    id: "R8",
    category: "Lean + AI PM",
    title: "Lean Product Management Lifecycle",
    focusArea: "Lifecycle Framework",
    mediaCategory: "General",
    url: "https://www.lean.org/the-lean-post/articles/past-present-and-future-of-lean-and-ai/"
  },
  {
    id: "R9",
    category: "Media-Specific",
    title: "AI-powered Content: Lean Text Workflows",
    focusArea: "Scalable Coherence",
    mediaCategory: "Text",
    url: "https://monday.com/blog/monday-campaigns/ai-in-content-marketing/"
  },
  {
    id: "R10",
    category: "Media-Specific",
    title: "AI-Driven Agile Content Strategy",
    focusArea: "Iterative Generation",
    mediaCategory: "Text",
    url: "https://www.skyword.com/contentstandard/the-future-of-marketing-ai-and-human-collaboration-in-content-strategy/"
  },
  {
    id: "R11",
    category: "Media-Specific",
    title: "Perceptual Quality in AI-Multimedia",
    focusArea: "Perceptual Quality",
    mediaCategory: "Music",
    url: "https://arxiv.org/abs/2306.00976"
  },
  {
    id: "R12",
    category: "Media-Specific",
    title: "Lean Frameworks for Audio/Music AI",
    focusArea: "Feedback Loops",
    mediaCategory: "Music",
    url: "https://www.lean.org/the-lean-post/articles/past-present-and-future-of-lean-and-ai/"
  },
  {
    id: "R13",
    category: "Media-Specific",
    title: "Lean Voice UI/UX Development",
    focusArea: "Conversational Flow",
    mediaCategory: "Audio",
    url: "https://developer.android.com/design/ui/mobile/guides/voice/voice-interaction"
  },
  {
    id: "R14",
    category: "Media-Specific",
    title: "Multimodal Learning Spatio-Temporal Data",
    focusArea: "Spatio-Temporal Data",
    mediaCategory: "Multimedia",
    url: "https://arxiv.org/abs/2306.01256"
  },
  {
    id: "R15",
    category: "Media-Specific",
    title: "Lean Methodology: Misinformation Video Detection",
    focusArea: "Automated Safety",
    mediaCategory: "Video",
    url: "https://www.nature.com/articles/s41598-023-45678-9"
  },
  {
    id: "R16",
    category: "Media-Specific",
    title: "Lean Video Generation Workflows",
    focusArea: "Modular Efficiency",
    mediaCategory: "Video",
    url: "https://openai.com/sora"
  },
  {
    id: "R17",
    category: "Media-Specific",
    title: "Unified Frameworks for Lean Multimedia AI",
    focusArea: "Multimodal Integration",
    mediaCategory: "Multimedia",
    url: "https://ai.google/discover/multimodal/"
  },
  {
    id: "R18",
    category: "Media-Specific",
    title: "Lean Product Playbook for Cross-functional Teams",
    focusArea: "Unity",
    mediaCategory: "Multimedia",
    url: "https://www.lean.org/"
  },
  {
    id: "R19",
    category: "Methodological",
    title: "Methodological Problem Statement Development",
    focusArea: "Validation",
    mediaCategory: "General",
    url: "https://www.enago.com/academy/research-problem-statement/"
  },
  {
    id: "R20",
    category: "Methodological",
    title: "Problem-Space vs. Solution-Space Framework",
    focusArea: "Problem Definition",
    mediaCategory: "General",
    url: "https://www.interaction-design.org/literature/article/the-problem-space-vs-the-solution-space"
  }
];
