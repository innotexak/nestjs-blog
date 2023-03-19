import * as Mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
const BlogSchema = SchemaFactory.createForClass(Blog);

export { BlogSchema };
