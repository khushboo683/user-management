import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './userDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    try{
        return await this.userService.create(createUserDto);
    }catch(err){
     throw err;
    }

  }

  @Get('/')
  async findAll() {
    try{
    return await this.userService.findAll();
    }catch(err){
        throw err;
    }
  }
  @Patch('/')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto)
   {
    try{
    return await this.userService.update(id, updateUserDto);
    }catch(err){
        throw err;
    }
  }

  @Delete('/')
  async remove(@Param('id') id: string) {
    try{
    return await this.userService.remove(id);
    }catch(err){
        throw err;
    }
  }

  @Get('/search')
  async search(@Query() searchUserDto: SearchUserDto) {
    try{
        return await this.userService.search(searchUserDto);
    }catch(err){
       throw err;
    }

  }
}
