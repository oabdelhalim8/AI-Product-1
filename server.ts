import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to interact with Gemini
async function getGeminiResponse(systemInstruction: string, prompt: string, schema?: any) {
  try {
    const config: any = {
      systemInstruction,
      temperature: 0.2,
    };

    if (schema) {
      config.responseMimeType = "application/json";
      config.responseSchema = schema;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config,
    });

    return response.text;
  } catch (err: any) {
    console.error("Gemini call failed:", err);
    throw err;
  }
}

// 1. Propose Next Node API
app.post("/api/generate-node", async (req, res) => {
  const { problemStatement, currentNodes, currentEdges, layer, nodeType, userPrompt } = req.body;

  const systemInstruction = `You are an expert Technical Lead and ML/NLP system architect. 
You help Omar, an expert practitioner, construct an agnostic product management graph node by node.
Your proposal MUST conform strictly to the 'Functional Skeleton' and 'Data Scaffolds'.
The node belongs to the layer: '${layer}' and should have type: '${nodeType}'.

Layer Definitions:
- MM_ (Mind Map): High-level product strategy, hypothesis mapping, conceptual alignment, roadmap, and entity relations.
- OP_ (Operational): Operational triggers, automation inputs [INPUT: <Doc_Type>] and triggers.
- SYS_ (System): Deep technical architecture including ML thresholds, statistical thresholds, data types, and feedback loops.

Special Node Types:
- GOV_NODE: Governing inputs (Problem Statement, Business Case).
- HITL_GATE: Human-in-the-loop validation (pause for Omar's explicit review).
- A_TRG: Automation Trigger (diamond shape for automated logic like event/time/threshold triggers).

You must output a highly professional, well-reasoned node proposal. Return the data as JSON matching the schema.`;

  const nodeSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique short identifier (e.g., MM_STRATEGY, OP_TRIGGER, SYS_MODEL_THRESHOLD)" },
      label: { type: Type.STRING, description: "Elegant, literal, human-friendly title (avoid pseudo-intellectual or marketing prefix slop)" },
      description: { type: Type.STRING, description: "Detailed technical reasoning or hypothesis explaining why this node exists" },
      dataType: { type: Type.STRING, description: "Data type if applicable, e.g. Text, Scalar, Audio, JSON, Vector" },
      priority: { type: Type.STRING, description: "P1, P2, or P3" },
      dataPlaceholder: { type: Type.STRING, description: "If this node needs data, specify the exact placeholder name following the '[INPUT: <Doc_Type>]' pattern" },
      metadata: {
        type: Type.OBJECT,
        properties: {
          threshold: { type: Type.STRING, description: "E.g., confidence score > 0.85, accuracy >= 95%" },
          sla: { type: Type.STRING, description: "E.g., <200ms latency, daily refresh" },
          metrics: { type: Type.STRING, description: "Key performance indicators to track" },
        }
      }
    },
    required: ["id", "label", "description"]
  };

  const prompt = `Problem Statement / Primary Objective:
"${problemStatement || "Not defined yet"}"

Current Graph State:
Nodes: ${JSON.stringify(currentNodes || [])}
Edges: ${JSON.stringify(currentEdges || [])}

Requested Layer: ${layer}
Requested Node Type: ${nodeType}
User context/refinement prompt: "${userPrompt || "Propose the most logical next node to advance the product hypothesis."}"`;

  try {
    const textResponse = await getGeminiResponse(systemInstruction, prompt, nodeSchema);
    res.json(JSON.parse(textResponse || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate node proposal" });
  }
});

// 2. Suggest Connection Edge API
app.post("/api/suggest-edge", async (req, res) => {
  const { problemStatement, sourceNode, targetNode, userPrompt } = req.body;

  const systemInstruction = `You are an expert Technical Lead and ML/NLP system architect.
Suggest the exact constraint edge (C_EDGE) connection between Node A and Node B.
According to the Functional Skeleton:
- Constraint Edge (C_EDGE) should specify clear logical rules or thresholds: Node_A -- [C: Threshold > 0.85] --> Node_B.
- State exactly how the data flow, mathematical trigger, or automated transition occurs.
Return a clean, structured JSON response with edge configuration options.`;

  const edgeSchema = {
    type: Type.OBJECT,
    properties: {
      label: { type: Type.STRING, description: "Clear mathematical constraint, trigger condition, or dependency label (e.g. '[C: Accuracy > 0.90]')" },
      edgeType: { type: Type.STRING, description: "Edge type: 'C_EDGE' (for constraints), 'STANDARD' (regular progression), or 'FEEDBACK' (for loops)" },
      reasoning: { type: Type.STRING, description: "A concise explanation of the threshold, data dependency, or trigger constraint." }
    },
    required: ["label", "edgeType", "reasoning"]
  };

  const prompt = `Problem Statement: "${problemStatement}"
Source Node (A): ${JSON.stringify(sourceNode)}
Target Node (B): ${JSON.stringify(targetNode)}
User Prompt / Context: "${userPrompt || "Suggest a highly logical, professional mathematical constraint or trigger condition."}"`;

  try {
    const textResponse = await getGeminiResponse(systemInstruction, prompt, edgeSchema);
    res.json(JSON.parse(textResponse || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to suggest edge constraint" });
  }
});

// 3. Generate Synthetic Mock Data API
app.post("/api/generate-mock-data", async (req, res) => {
  const { placeholderName, dataType, nodeLabel } = req.body;

  const systemInstruction = `You are a SOTA ML/NLP system data generator.
Create realistic, production-quality synthetic mock data matching the requested data placeholder and data type.
This fulfills the Data Scaffold protocol for '[INPUT: Doc_Type]'.
Format the response as a clean JSON with realistic field names and sample entries. No markdowns, just pure JSON.`;

  const prompt = `Create mock data for:
Node Name: "${nodeLabel}"
Placeholder: "${placeholderName}"
Data Type / Modality: "${dataType || "JSON"}"`;

  try {
    const textResponse = await getGeminiResponse(systemInstruction, prompt);
    res.json({ mockData: textResponse });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate synthetic data" });
  }
});

// Serve Frontend using Vite Middleware in Development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
