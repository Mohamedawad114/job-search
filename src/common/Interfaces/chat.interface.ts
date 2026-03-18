import { Types } from 'mongoose';

export interface IMessage {
  conversionId: Types.ObjectId;
  content: string;
}
// export interface IConversion{
//     roomId:
// }