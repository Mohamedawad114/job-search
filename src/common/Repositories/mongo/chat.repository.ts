import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversion,
  conversionDocument,
  Message,
  MessageDocument,
} from '../../DB/';

@Injectable()
export class ConversionRepository extends BaseRepository<conversionDocument> {
  constructor(
    @InjectModel(Conversion.name)
    protected conversionModel: Model<conversionDocument>,
  ) {
    super(conversionModel);
  }
}
@Injectable()
export class MessageRepository extends BaseRepository<MessageDocument> {
  constructor(
    @InjectModel(Message.name)
    protected messageModel: Model<MessageDocument>,
  ) {
    super(messageModel);
  }
}
