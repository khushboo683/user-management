import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './userDto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(dto => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [{ id: '1', name: 'Test User' }]),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ id })),
    search: jest.fn((dto, userId) => [{ id: '1', name: 'Test User', userId }])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { name: 'Test User', surname: 'Test surname', username: 'testuser', birthdate: "18-10-1999" };
      expect(await controller.create(createUserDto)).toEqual({ id: '1', ...createUserDto });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([{ id: '1', name: 'Test User' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const req = { userId: { userId: '1' } };
      expect(await controller.update(req, updateUserDto)).toEqual({ id: '1', ...updateUserDto });
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await controller.remove('1')).toEqual({ id: '1' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search for users', async () => {
      const searchUserDto: SearchUserDto = { username: 'testuser', minAge: 20, maxAge: 30 };
      const req = { userId: { userId: '1' } };
      expect(await controller.search(req, searchUserDto)).toEqual([{ id: '1', name: 'Test User', userId: '1' }]);
      expect(service.search).toHaveBeenCalledWith(searchUserDto, '1');
    });
  });
});
