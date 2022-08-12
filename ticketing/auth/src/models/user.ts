import { Document, Model, Schema, model } from "mongoose";

import { PasswordManager } from "../services/password-manager";

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

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    this.password = await PasswordManager.toHash(this.password);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
