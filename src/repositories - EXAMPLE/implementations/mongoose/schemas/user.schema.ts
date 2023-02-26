import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    // Declarando esse id como Opcional, pois em MongooseUserRepository eu vou SETAR ele
    // com o mesmo valor de _id, para satisfazer o id da Interface IUser !!!
    @Prop({ type: Types.ObjectId, unique: true })
    id: Types.ObjectId;

    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
