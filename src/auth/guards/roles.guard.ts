import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";  // --> read metadata that we stored with decorators
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable() // --> allows dependency injection
export class RolesGuard implements CanActivate{ // --> interface for guards
    constructor(private reflector: Reflector){}
    
    canActivate(context: ExecutionContext): boolean {  // --> gives request info
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()],)
        if(!requiredRoles){
            return true
        }
        const {user} = context.switchToHttp().getRequest()
        console.log("User from JWT:", user)
        console.log("Required roles:",requiredRoles)
        return requiredRoles.includes(user.role)
    }
}