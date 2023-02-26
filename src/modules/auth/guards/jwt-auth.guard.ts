import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private _reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const isPublic = this._reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const canActivate = super.canActivate(context);

        if (typeof canActivate === 'boolean') {
            return canActivate;
        }

        const canActivatePromise = canActivate as Promise<boolean>;

        return canActivatePromise.catch((error) => {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid or expired token !');
            }

            throw new UnauthorizedException();
        });
    }
}
