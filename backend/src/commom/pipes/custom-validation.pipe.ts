import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((error) =>
        error.constraints
          ? Object.values(error.constraints)
          : ['Erro de validação'],
      );

      throw new UnprocessableEntityException({
        statusCode: 422,
        message: messages,
        error: 'Unprocessable Entity',
      });
    }

    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
