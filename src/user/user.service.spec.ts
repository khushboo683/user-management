import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { UserService } from './user.service';
import { User, UserDocument } from '../models/userSchema';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './userDto';
import { NotFoundException } from '@nestjs/common';

const mockUserModel = {
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
};

const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    store: {
        keys: jest.fn()
    }
};

describe('UserService', () => {
    let service: UserService;
    let model: Model<UserDocument>;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        model = module.get<Model<UserDocument>>(getModelToken(User.name));
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'Khushboo',
                surname: 'Dev',
                username: 'khushboo_99',
                birthdate: '01-01-2000',
            };
            const parsedDate = new Date(Date.UTC(2000, 0, 1)); // Mock parsed date
      jest.spyOn(service, 'parseDate').mockReturnValue(parsedDate);

      const savedUser = { ...createUserDto, birthdate: parsedDate, _id: 'a id', blockedUsers: [] } as UserDocument;
            jest.spyOn(model, 'create').mockResolvedValue(savedUser as any);

            const result = await service.create(createUserDto);

      expect(service.parseDate).toHaveBeenCalledWith('01-01-2000');
      expect(result).toEqual(savedUser);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [{ username: 'JohnDoe' }] as UserDocument[];
            jest.spyOn(model, 'find').mockReturnValue(users as any);

            const result = await service.findAll();

            expect(result).toEqual(users);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { username: 'JohnUpdated' };
            const updatedUser = { username: 'JohnUpdated' } as UserDocument;
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue(updatedUser as any);

            const result = await service.update('a id', updateUserDto);

            expect(result).toEqual(updatedUser);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue(null);

            await expect(service.update('a id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const user = { _id: 'a id', username: 'JohnDoe' } as UserDocument;
            jest.spyOn(model, 'findByIdAndDelete').mockReturnValue(user as any);

            const result = await service.remove('a id');

            expect(result).toEqual(user);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(model, 'findByIdAndDelete').mockReturnValue(null);

            await expect(service.remove('a id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('search', () => {
        it('should return users based on search criteria', async () => {
            const searchUserDto: SearchUserDto = { username: 'John' };
            const userId = 'a id';
            const user = { _id: userId, blockedUsers: [] } as UserDocument;
            const users = [{ username: 'JohnDoe' }] as UserDocument[];

            jest.spyOn(model, 'findById').mockReturnValue(user as any);
            jest.spyOn(model, 'find').mockReturnValue(users as any);
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
            jest.spyOn(cacheManager, 'set').mockResolvedValue(null);

            const result = await service.search(searchUserDto, userId);

            expect(result).toEqual(users);
        });

        it('should throw NotFoundException if user not found', async () => {
            const searchUserDto: SearchUserDto = { username: 'John' };
            const userId = 'a id';

            jest.spyOn(model, 'findById').mockReturnValue(null);

            await expect(service.search(searchUserDto, userId)).rejects.toThrow(NotFoundException);
        });
    });
});
