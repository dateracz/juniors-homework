import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [OpenaiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
