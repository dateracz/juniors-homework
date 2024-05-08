import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import openaiConfig from './openai.config';

@Module({
  imports: [ConfigModule.forFeature(openaiConfig)],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
