import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'date should not be empty' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty({ message: 'products should not be empty' })
  @IsString({ each: true, message: 'each categoryId should be a string' })
  @Type(() => String)
  products: string[];

  @IsNotEmpty()
  @IsNumber()
  total: number;
}
