import { Document, Model, Schema, model } from "mongoose";

import { Password } from "../services/password";

interface UserAttributes {
  email: string;
  password: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
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

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    this.password = await Password.toHash(this.password);
  }

  done();
});

userSchema.statics.build = (attrs: UserDocument) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
