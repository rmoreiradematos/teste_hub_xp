import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Products } from 'src/products/schemas/products.schemas';

@Schema({
  collection: 'categories',
  timestamps: true,
})
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Products' }] })
  productIds: Products[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
