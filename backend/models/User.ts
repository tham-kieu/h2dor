import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  favorites?: mongoose.Types.ObjectId[];

  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    avatar: {
      type: String,
      default: ''
    },

    phone: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: Date,

    resetPasswordToken: String,

    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Hash password trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// So sánh mật khẩu
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Tạo JWT Token
userSchema.methods.getSignedJwtToken = function (): string {
  return jwt.sign(
    {
      id: this._id.toString(),
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d'
    }
  );
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;