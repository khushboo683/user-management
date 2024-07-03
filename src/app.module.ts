import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    CacheModule.register({
     isGlobal:true,
     ttl:5,
     max: 10
    }
    ),
    UserModule, BlockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
