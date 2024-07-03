import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
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
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto)
   {
    const userId = req.userId.userId;
    try{
    return await this.userService.update(userId, updateUserDto);
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
  async search(@Req() req,@Query() searchUserDto: SearchUserDto) {
    try{
        const userId = req.userId.userId;
        return await this.userService.search(searchUserDto,userId);
    }catch(err){
       throw err;
    }

  }
}
