export interface INotify {
    readonly payer_name: string;
    readonly payer_cpf: string;
    readonly transfer_amount: number;
    readonly transfer_time: Date;
    readonly to_user_id: string;
}
