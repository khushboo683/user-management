import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/userSchema'
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './userDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Types } from 'mongoose';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
) {}
parseDate(date:string){
    const[day,month,year] = date.split('-').map(Number);
    return new Date(Date.UTC(year,month-1,day));
}
isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const{birthdate} = createUserDto;
    const parsedDate= this.parseDate(birthdate);
    const createdUser = new this.userModel({...createUserDto,birthdate:parsedDate});
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
  async search(searchUserDto: SearchUserDto): Promise<User[]> {
    console.log("query", searchUserDto);
    const cacheKey = JSON.stringify(searchUserDto);
    const cachedResult = await this.cacheManager.get<User[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const { username, minAge, maxAge } = searchUserDto;
    const query: any = {};

    if (username) {
      query.username = new RegExp(username, 'i');
    }

    const currentDate = new Date();

    if (minAge !== undefined) {
      query.birthdate = {
        $lte: new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate())
      };
    }

    if (maxAge !== undefined) {
      const maxAgeDate = new Date(currentDate.getFullYear() - maxAge, currentDate.getMonth(), currentDate.getDate());
      query.birthdate = query.birthdate 
        ? { ...query.birthdate, $gte: maxAgeDate } 
        : { $gte: maxAgeDate };
    }

    console.log("MongoDB Query", query);

    const users = await this.userModel.find(query).exec();
    await this.cacheManager.set(cacheKey, users);
    return users;
  }
}
