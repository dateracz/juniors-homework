import { Inject, Injectable } from '@nestjs/common';
import openaiConfig, { OpenAiConfig } from './openai.config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  public readonly openaiClient!: OpenAI;

  constructor(@Inject(openaiConfig.KEY) private openaiConfig: OpenAiConfig) {
    this.openaiClient = new OpenAI({
      apiKey: this.openaiConfig.apiKey,
    });
  }

  createCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: OpenAI.Chat.ChatModel = 'gpt-3.5-turbo-0125'
  ) {
    return this.openaiClient.chat.completions.create({
      model,
      messages,
    });
  }
}
