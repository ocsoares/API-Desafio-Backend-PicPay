import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserPayload } from 'src/modules/auth/models/IUserPayload';
import { LoginUserService } from './login-user.service';

describe('LoginUserService', () => {
    let service: LoginUserService;

    const JWT = 'any_jwt';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUserService,
                {
                    provide: JwtService,
                    useExisting: JwtService, // Usa uma Instância EXISTENTE de JwtService (OBRIGATÓRIO) !!!
                    useValue: {
                        sign: jest.fn().mockResolvedValue(JWT),
                    },
                },
            ],
        }).compile();

        service = module.get<LoginUserService>(LoginUserService);

        jest.spyOn(service, 'execute');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate a JWT with a valid payload', async () => {
        const payload: IUserPayload = {
            sub: 'any_id',
            name: 'Teste',
            email: 'teste@gmail.com',
        };

        const result = await service.execute(payload);

        expect(result).toEqual(JWT);
        expect(service.execute).toHaveBeenCalledTimes(1);
        expect(service.execute).toHaveBeenCalledWith(payload);
    });
});
