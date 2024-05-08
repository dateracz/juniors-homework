import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IResponse, MessageRequest } from '@ukol-01/common';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async messageReceiver(@Body() body: MessageRequest) {
    console.log('received message', body.text);
    const answer = await this.chatService.getAnswer(body.text);
    console.log('got answer', answer);
    return {
      message: answer.choices[0].message.content,
    } as IResponse;
  }
}
