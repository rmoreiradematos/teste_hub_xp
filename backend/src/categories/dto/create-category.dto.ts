import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'Name should no to be empty' })
  name: string;
}
