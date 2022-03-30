import * as jwt from "jsonwebtoken";
import {CanActivate, ExecutionContext} from "@nestjs/common";

export class AuthGuard implements CanActivate {
   async canActivate(context: ExecutionContext): Promise<boolean> {
       const req = context.switchToHttp().getRequest()
       const res = context.switchToHttp().getResponse()
       const token = req.headers.authorization.split(' ');
         try {
            const jwtPayload = jwt.verify(token[1], process.env.JWT_ACCESS);
            if(typeof jwtPayload !== "string") {
                res.locals.token  = jwtPayload.id;
            }
            return true;
        } catch (error) {
            return false ;
        }
    }
}