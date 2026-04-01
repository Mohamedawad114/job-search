import { Types } from 'mongoose';
import { conversionType } from '../Enum';

export interface IMessage {
  senderId: number;
  conversionId: Types.ObjectId;
  content: string;
}
export interface IConversion {
  _id?: Types.ObjectId | string;
  type: conversionType;
  adminId?: number;
  name?: string;
  memberIds: number[];
}
