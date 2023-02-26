export interface returnHandle {
    message: string;
    data: any;
}

// NÃO precisa passar o Request e Response no handle porque isso o Nest faz AUTOMATICAMENTE !!
// OBS: Deixei o dataNestDecorator como opcional porque vai ter Rotas que vão precisar e outras
// não, por exemplo, retornar TODOS os Dados de algo, e object porque precisa Receber uma
// Interface (DTO) !!

// Usei ...args para receber Nenhum ou DIVERSOS Parâmetros, do tipo Objeto !!!
export interface IController {
    handle(...args: object[]): Promise<returnHandle>;
}
