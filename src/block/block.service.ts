import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../models/userSchema';

@Injectable()
export class BlockService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async blockUser(userId:string, blockedUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    const userToBeBlocked = await this.userModel.findById(blockedUserId).exec();
    if (!user || !userToBeBlocked) {
      throw new NotFoundException('User not found');
    }
    const blockedUserInd=user.blockedUsers.findIndex(blockedUser=>blockedUser===blockedUserId)
    if(blockedUserInd!==-1){
        throw new BadRequestException('User is already blocked!')
    }
    user.blockedUsers.push(blockedUserId);
    return user.save();
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    const userToBeUnblocked = await this.userModel.findById(blockedUserId).exec();
    if (!user || !userToBeUnblocked) {
      throw new NotFoundException('User not found');
    }
    const blockedUserInd=user.blockedUsers.findIndex(blockedUser=>blockedUser===blockedUserId)
    if(blockedUserInd ===-1){
        throw new BadRequestException('User is not blocked!')
    }
    user.blockedUsers = user.blockedUsers.filter(id => id !== blockedUserId);
    return user.save();
  }
}
