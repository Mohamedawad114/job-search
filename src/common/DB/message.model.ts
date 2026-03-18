import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IMessage } from '../Interfaces';

@Schema({ strict: true, strictQuery: true, autoIndex: true, timestamps: true })
export class Message implements IMessage {
  @Prop({ type: Types.ObjectId, required: true })
  conversionId: Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    maxLength: 800,
  })
  content: string;
  @Prop({ type: Boolean, default: false })
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversionId: 1 });

export type MessageDocument = HydratedDocument<Message>;
export const MessageModel = MongooseModule.forFeature([
  {
    schema: MessageSchema,
    name: Message.name,
  },
]);
