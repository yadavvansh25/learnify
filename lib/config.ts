export const config = {
  app: {
    name: 'Learnify',
    version: '2.1.0',
    description: 'Autonomous Exam-First Agentic RAG, Knowledge Graph & Visual Reasoning Engine',
  },
  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'learnify_secret_token_2026',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
  },
  providers: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    claudeApiKey: process.env.ANTHROPIC_API_KEY || '',
  }
};
