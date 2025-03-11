import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'name should not be empty' })
  name: string;

  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'description should not be empty' })
  description: string;

  @IsNotEmpty({ message: 'price is required' })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'price should be a number' },
  )
  price: number;

  @IsNotEmpty()
  @IsArray({ message: 'categoryIds should be an array' })
  @IsString({ each: true, message: 'each categoryId should be a string' })
  @Type(() => String)
  categoryIds: string[];

  @IsEmpty()
  imageUrl: string;
}
