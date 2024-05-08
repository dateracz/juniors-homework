import { registerAs } from '@nestjs/config';

export default registerAs<OpenAiConfig>(
  'openai',
  () =>
    ({
      apiKey: process.env.OPENAI_API_KEY,
    } as OpenAiConfig)
);

export interface OpenAiConfig {
  apiKey: string;
}
