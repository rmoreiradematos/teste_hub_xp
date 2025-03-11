import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Products extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  categoryIds: Category[];

  @Prop({ required: false })
  imageUrl: string;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
