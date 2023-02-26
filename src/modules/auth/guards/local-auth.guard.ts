import { AuthGuard } from '@nestjs/passport';
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

// Guards são usados como Middleware de Autenticação para PROTEGER Rotas Específicas !!!
// OBS: ESSE Guard em Específico vai ser usado APENAS no LOGIN !!!

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    // Trata o erro do mecanismo de Token !
    // OBS: Acho que esse user é o User que, se validado com Sucesso, o Nest coloca dentro
    // dessa Variável !!
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException(err?.message);
        }

        return user;
    }
}
