import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IConversion } from '../Interfaces';
import { conversionType } from '../Enum';

@Schema({ strict: true, strictQuery: true, autoIndex: true, timestamps: true })
export class Conversion implements IConversion {
  @Prop([
    {
      type: Number,
      required: true,
    },
  ])
  memberIds: number[];
  @Prop({ type: String, enum: conversionType, default: conversionType.private })
  type: conversionType;
  @Prop({
    type: Number,
    required: function (this: IConversion) {
      return this.type == conversionType.group;
    },
  })
  adminId: number;
  @Prop({
    type: String,
    required: function (this: IConversion) {
      return this.type == conversionType.group;
    },
  })
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversionSchema = SchemaFactory.createForClass(Conversion);

export type conversionDocument = HydratedDocument<Conversion>;
export const conversionModel = MongooseModule.forFeature([
  {
    schema: conversionSchema,
    name: Conversion.name,
  },
]);
