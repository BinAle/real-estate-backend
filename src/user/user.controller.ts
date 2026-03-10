import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UserController {
    constructor( private readonly userService: UserService) {}
    // Get full user profile from DB
    @UseGuards(JwtAuthGuard, RolesGuard) // logged-in users can access it
    @Get('me')
    async getProfile(@CurrentUser() currentUser){
        return this.userService.findById(currentUser.userId)
    }
}
