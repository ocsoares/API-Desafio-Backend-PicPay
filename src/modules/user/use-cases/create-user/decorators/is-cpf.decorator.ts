/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
} from 'class-validator';

import { cpf } from 'cpf-cnpj-validator';

function validateCPF(value: string): boolean {
    const formatCPF = cpf.format(value);

    if (value !== formatCPF) {
        return false;
    }

    return cpf.isValid(value);
}

export function IsCPF(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isCPF',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return validateCPF(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} deve ser um CPF válido`;
                },
            },
        });
    };
}
