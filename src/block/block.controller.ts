import { Controller, Post, Param } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post(':userId/block/:blockedUserId')
  blockUser(@Param('userId') userId: string, @Param('blockedUserId') blockedUserId: string) {
    return this.blockService.blockUser(userId, blockedUserId);
  }

  @Post(':userId/unblock/:blockedUserId')
  unblockUser(@Param('userId') userId: string, @Param('blockedUserId') blockedUserId: string) {
    return this.blockService.unblockUser(userId, blockedUserId);
  }
}
