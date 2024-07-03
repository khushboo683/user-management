import { Controller, Post, Param, Req } from '@nestjs/common';
import { BlockService } from './block.service';
import { ObjectId } from 'mongoose';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  //endpoint to block user
  @Post('/:blockedUserId')
  async blockUser(@Req() req:any, @Param('blockedUserId') blockedUserId: string) {
    try{  
    const userId = req.userId.userId;
    return await this.blockService.blockUser( userId,blockedUserId);
    }catch(err){
        throw err;
    }
  }
  //endpoint to unblock the user
  @Post('/unblock/:blockedUserId')
  async unblockUser(@Req() req:any,@Param('blockedUserId') blockedUserId: string) {
    try{
        const userId = req.userId.userId;
    return await this.blockService.unblockUser(userId,blockedUserId);
    }catch(err){
        throw err;
    }
  }
}
