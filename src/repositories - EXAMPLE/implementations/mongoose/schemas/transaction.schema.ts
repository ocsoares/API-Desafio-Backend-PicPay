import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
    @Prop({ type: String, required: true })
    account_id: string;

    @Prop({ type: Types.ObjectId, unique: true })
    transfer_id: Types.ObjectId;

    @Prop({ type: Date, required: true, default: Date.now })
    date: Date;

    @Prop({ type: Number, required: true })
    transfer_amount: number;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true, enum: ['debit_card', 'credit_card'] })
    payment_method: 'debit_card' | 'credit_card';

    @Prop({ type: String, required: true, minlength: 8, maxlength: 8 })
    card_number: string;

    @Prop({ type: String, required: true })
    card_holder: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
