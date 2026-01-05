import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

export function IsOTP(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isOTP',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          for (const ch of value) {
            if (ch < '0' || ch > '9') return false;
          }
          return typeof value === 'string' && value.length === 6; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
