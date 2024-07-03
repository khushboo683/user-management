import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/userSchema';

@Injectable()
export class BlockService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async blockUser(userId: string, blockedUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.blockedUsers.push(blockedUserId);
    return user.save();
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.blockedUsers = user.blockedUsers.filter(id => id !== blockedUserId);
    return user.save();
  }
}
