import { Injectable, NestMiddleware } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1]; 
    console.log("token",token)
    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log('decoded',decoded)
        req.userId = decoded; 
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
    next();
  }
}