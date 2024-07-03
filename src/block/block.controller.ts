import { Controller, Post, Param, Req } from '@nestjs/common';
import { BlockService } from './block.service';
import { ObjectId } from 'mongoose';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('/:blockedUserId')
  async blockUser(@Req() req, @Param('blockedUserId') blockedUserId: string) {
    try{
    console.log("Req",req);    
    const userId = req.userId.userId;
    return await this.blockService.blockUser( userId,blockedUserId);
    }catch(err){
        throw err;
    }
  }

  @Post('/unblock/:blockedUserId')
  async unblockUser(@Req() req,@Param('blockedUserId') blockedUserId: string) {
    try{
        const userId = req.userId.userId;
    return await this.blockService.unblockUser(userId,blockedUserId);
    }catch(err){
        throw err;
    }
  }
}
