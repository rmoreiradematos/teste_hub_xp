import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class Orders extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  products: Types.ObjectId[];

  @Prop({ required: true })
  total: number;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
