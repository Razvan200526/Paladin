import { GoogleGenAI } from '@google/genai';
import { inject, service } from '@razvan11/paladin';

export interface StreamChunk {
  type: 'token' | 'complete' | 'error';
  content: string;
  messageId?: string;
}

export interface ChatContext {
  role: 'user' | 'model';
  content: string;
}

@service()
export class AiQueryService {
  private geminiClient: GoogleGenAI;

  constructor(@inject('GEMINI_API_KEY') private apiKey: string) {
    this.geminiClient = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Stream a response from Gemini AI
   * @param message - The user's message
   * @param context - Previous conversation context for multi-turn chat
   * @param onChunk - Callback for each token chunk
   */
  async streamResponse(
    message: string,
    onChunk: (chunk: StreamChunk) => void,
    context: ChatContext[] = [],
  ): Promise<string> {
    try {
      const contents = [
        ...context.map((ctx) => ({
          role: ctx.role,
          parts: [{ text: ctx.content }],
        })),
        {
          role: 'user' as const,
          parts: [{ text: message }],
        },
      ];

      const systemInstruction = `You are a helpful career assistant for a job search platform.
You help users with:
- Resume writing and optimization
- Cover letter creation
- Job search strategies
- Interview preparation
- Career advice

Be concise, helpful, and encouraging. Format responses with markdown when appropriate.`;

      const response = await this.geminiClient.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          maxOutputTokens: 1000,
        },
      });

      let fullResponse = '';

      for await (const chunk of response) {
        const text = chunk.text || '';
        if (text) {
          fullResponse += text;
          onChunk({
            type: 'token',
            content: text,
          });
        }
      }

      onChunk({
        type: 'complete',
        content: fullResponse,
      });

      return fullResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      onChunk({
        type: 'error',
        content: errorMessage,
      });
      throw error;
    }
  }

  /**
   * Generate a non-streaming response (for simpler use cases)
   */
  async generateResponse(
    message: string,
    context: ChatContext[] = [],
  ): Promise<string> {
    const contents = [
      ...context.map((ctx) => ({
        role: ctx.role,
        parts: [{ text: ctx.content }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: message }],
      },
    ];

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        maxOutputTokens: 1000,
      },
    });

    return response.text || '';
  }
}
