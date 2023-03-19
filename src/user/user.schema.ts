import { Prop, SchemaFactory, Schema, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  userName: string;

  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;
}
const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
