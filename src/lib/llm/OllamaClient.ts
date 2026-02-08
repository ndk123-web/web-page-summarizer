import type { LLMClient } from "./LLMClient"

export class OllamaClient implements LLMClient {
  constructor(private baseUrl: string, private model: string) {}

  async chat(prompt: string): Promise<string> {
    console.log(`Sending to Ollama at ${this.baseUrl} with model ${this.model}`);
    // fetch http://localhost:11434
    return "ollama response for: " + prompt
  }
}
