import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/userSchema';

@Module({
  imports:[UserModule, 
    MongooseModule.forFeature([{name:User.name, schema: UserSchema}])
   ],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
