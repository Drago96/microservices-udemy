import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

interface UserAttributes {
  email: string;
  password: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttributes): HydratedDocument<UserDocument>;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserDocument) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
