import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

describe('BlockController', () => {
  let controller: BlockController;
  let blockService: BlockService;

  const mockBlockService = {
    blockUser: jest.fn((userId, blockedUserId) => ({ userId, blockedUserId })),
    unblockUser: jest.fn((userId, blockedUserId) => ({ userId, blockedUserId })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockController],
      providers: [
        {
          provide: BlockService,
          useValue: mockBlockService,
        },
      ],
    }).compile();

    controller = module.get<BlockController>(BlockController);
    blockService = module.get<BlockService>(BlockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('blockUser', () => {
    it('should block a user', async () => {
      const userId = 'user123';
      const blockedUserId = 'blocked456';
      expect(await controller.blockUser({ userId: { userId } }, blockedUserId)).toEqual({ userId, blockedUserId });
      expect(blockService.blockUser).toHaveBeenCalledWith(userId, blockedUserId);
    });

    it('should throw an error if blockService.blockUser throws an error', async () => {
      const userId = 'user123';
      const blockedUserId = 'blocked456';
      const errorMessage = 'Error blocking user';
      jest.spyOn(blockService, 'blockUser').mockRejectedValue(new Error(errorMessage));

      await expect(controller.blockUser({ userId: { userId } }, blockedUserId)).rejects.toThrowError(errorMessage);
    });
  });

  describe('unblockUser', () => {
    it('should unblock a user', async () => {
      const userId = 'user123';
      const blockedUserId = 'blocked456';
      expect(await controller.unblockUser({ userId: { userId } }, blockedUserId)).toEqual({ userId, blockedUserId });
      expect(blockService.unblockUser).toHaveBeenCalledWith(userId, blockedUserId);
    });

    it('should throw an error if blockService.unblockUser throws an error', async () => {
      const userId = 'user123';
      const blockedUserId = 'blocked456';
      const errorMessage = 'Error unblocking user';
      jest.spyOn(blockService, 'unblockUser').mockRejectedValue(new Error(errorMessage));

      await expect(controller.unblockUser({ userId: { userId } }, blockedUserId)).rejects.toThrowError(errorMessage);
    });
  });
});
