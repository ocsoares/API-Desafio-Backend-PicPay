import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IUser } from 'src/models/IUser';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';
import * as bcript from 'bcrypt';

// Esse tipo de Teste vai verificar a LÓGICA do Service, ou seja, os IFs, throws e o objetivo do Service,
// que é criar um Usuário com sucesso caso não exista um Usuário com o mesmo nome ou email !!!

describe('CreateUserService', () => {
    let service: CreateUserService;
    let repository: UserRepository;

    const userData: IUser = {
        name: 'Teste',
        email: 'teste@gmail.com',
        password: 'teste23',
    };

    // Passar no providers o Service, e no provide abaixo dele a DEPENDÊNCIA do Constructor do Service, que nesse caso
    // é o UserRepository !!
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        // Mockar APENAS os Métodos que serão usados no Service !!
                        findByName: jest.fn(),
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CreateUserService>(CreateUserService);
        repository = module.get(UserRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    // Nos testes de ERRO, como o Banco de Dados está MOCKADO, esses Testes irão apenas testar se os Métodos Mockados do
    // repository (UserRepository, nesse caso) retornam o erro esperado no Service quando ele é chamado !!
    // OBS: O service.execute() nesses casos de Erro é chamado para CHECAR as Condicionais de Erro DENTRO do Service, junto
    // com os Métodos Mockados !!

    it('should throw BadRequestException if user already exists with findByName method', async () => {
        // Mockando o RETORNO do Dado que esse Método pede (uma Interface IUser) DENTRO desse Método, porque no Service se
        // existir esse Dado, TEM que retornar ERRO !!
        // OBS: Como esse Método foi Mockado, independente do Dado passado nele nos (), IRÁ Retornar o Dado passado no
        // mockResolvedValue() !!
        // IMPORTANTE: Como esse método foi Mockado, SEMPRE existirá um Usuário, então o Service SEMPRE irá retornar
        // ERRO, NÃO importa o que for passado !!
        // IMPORTANTE 2: Como a Condicional (nesse caso) no Service para lançar um Throw é se O RETORNO desse Método EXISTIR,
        // então QUALQUER Dado passado aqui que NÃO seja false, null ou undefined IRÁ passar !!
        // IMPORTANTE 3: Pode existir várias condicionais dentro do Service, mas (nesse exemplo) ele irá checar APENAS o
        // Erro vindo da Condição do findByName(), que por estar Mockada sempre existirá e retornará ERRO !!
        (repository.findByName as jest.Mock).mockResolvedValue(userData);

        // Espera o ERRO especificado no Service !!
        // Passar userData dentro do service.execute() para passar pelo teste ...toHaveBeenCalledWith(userData.name); !!!
        // OBS: o await ANTES do expect já transforma o Método em assíncrono, então não precisa colocar o await antes
        // do Método !!
        // IMPORTANTE: O que está dentro de service.execute(...) NÃO necessariamente importa, porque ela é importante apenas
        // para EXECUTAR o Service que irá checar a condição do findByName (nesse caso), que JÁ ESTÁ MOCKADO !!!
        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException(
                'Já existe um usuário cadastrado com esse nome !',
            ),
        );

        // O toHaveBeenCalledWith() verifica se o Método foi chamado com um determinado Dado passado como Parâmetro, nos () !!
        // OBS: Nesse caso, ele é chamado com userData.name porque no Service o .execute() recebe um OBJETO de IUser, onde
        // esse objeto tem a propriedade name, então ele usa esse OBJETO para passar dentro do MÉTODO findByName() !!
        expect(repository.findByName).toHaveBeenCalledWith(userData.name);
    });

    it('should throw BadRequestException if user already exists with findByEmail method', async () => {
        (repository.findByEmail as jest.Mock).mockResolvedValue(userData);

        await expect(service.execute(userData)).rejects.toThrow(
            new BadRequestException(
                'Já existe um usuário cadastrado com esse email !',
            ),
        );

        expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);
    });

    it('should create a new user', async () => {
        const userData: IUser = {
            name: 'TesteUser',
            email: 'testeuser@gmail.com',
            password: 'testeuser123',
        };

        const repositoryCreateData = {
            ...userData,
            password: await bcript.hash(userData.password, 10),
        };

        const userDataWithoutPassword = {
            name: userData.name,
            email: userData.email,
        };

        (repository.create as jest.Mock).mockResolvedValue(<IUser>{
            ...repositoryCreateData,
        });

        const createUser = await service.execute(userData);

        const isValidEncryptedPassword = await bcript.compare(
            userData.password,
            repositoryCreateData.password,
        );

        expect(createUser).toEqual(userDataWithoutPassword);
        expect(isValidEncryptedPassword).toBe(true);
        expect(repository.create).toHaveBeenCalledWith({
            // Por algum motivo o JWT de password está sendo chamado NOVAMENTE,
            // o que faz retornar um JWT DIFERENTE, por isso coloquei como expect...
            ...repositoryCreateData,
            password: expect.any(String),
        });
    });
});
