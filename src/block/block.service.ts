import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, UserDocument } from '../models/userSchema';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
) {}
 
  async blockUser(userId:string, blockedUserId: string): Promise<User> {

    //fetch user from db
    const user = await this.userModel.findById(userId).exec();

    //fetch user to be blocked from db
    const userToBeBlocked = await this.userModel.findById(blockedUserId).exec();
    
    //if either of the users does not exists, throw exception
    if (!user || !userToBeBlocked) {
      throw new NotFoundException('User not found');
    }

    // find index of blocked user from the blockedUsers array of the user
    const blockedUserInd=user.blockedUsers.findIndex(blockedUser=>blockedUser===blockedUserId)
    
    // if index exists that means user is already blocked.
    if(blockedUserInd!==-1){
        throw new BadRequestException('User is already blocked!')
    }

    // otherwise push the user in the blockedUser array
    user.blockedUsers.push(blockedUserId);

    // remove blocked user key from cache
    const cacheKeyPattern = `*${blockedUserId}*`;
    const keys = await this.cacheManager.store.keys(cacheKeyPattern);
    for (const key of keys) {
      await this.cacheManager.del(key);
    }

    // printing cache data for debugging
    await this.printAllCache();

    // save user
    return user.save();
  }
  // function to print cache data
  async printAllCache() {
    const keys = await this.cacheManager.store.keys();

    for (const key of keys) {
      const value = await this.cacheManager.get(key);
      console.log(`Key: ${key}, Value:`, value);
    }
  }
  async unblockUser(userId: string, blockedUserId: string): Promise<User> {

    // fetch user from db
    const user = await this.userModel.findById(userId).exec();

    // fetch user to be blocked from db
    const userToBeUnblocked = await this.userModel.findById(blockedUserId).exec();
    
    // if either of the user does not exists, throw exception
    if (!user || !userToBeUnblocked) {
      throw new NotFoundException('User not found');
    }

    // find index of user to be blocked in the blockedUser array
    const blockedUserInd=user.blockedUsers.findIndex(blockedUser=>blockedUser===blockedUserId)
    
    // if index==-1, that means user is not blocked
    if(blockedUserInd ===-1){
        throw new BadRequestException('User is not blocked!')
    }

    // other wise remove the user id from the blockedUser list
    user.blockedUsers = user.blockedUsers.filter(id => id !== blockedUserId);
    return user.save();
  }
}
