import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsTwoDecimalPlacesOrNoDecimal(
    validationOptions?: ValidationOptions,
) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'isTwoDecimalPlacesOrNoDecimal',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const regex = /^\d+(\.\d{1,2})?$/;
                    const isValid = regex.test(value.toString());

                    return isValid;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must have at most two decimal places`;
                },
            },
        });
    };
}
