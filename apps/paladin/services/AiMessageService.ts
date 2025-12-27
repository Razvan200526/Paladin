import { inject, service } from "@razvan11/paladin";
import { GoogleGenAI } from '@google/genai';

@service()
export class AiQueryService {

  private geminiClient: GoogleGenAI;
  constructor(@inject('GEMINI_API_KEY') private api_key: string) {
    const geminiClient = new GoogleGenAI({ apiKey: this.api_key });
  }

  async respondToUserQuestion(message: string) {

  }
}
