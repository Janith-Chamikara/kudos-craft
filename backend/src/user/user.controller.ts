import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AccountSetupDto } from './dto/user-account-setup.dto';
import { UserService } from './services/user.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('account-setup')
  async setupAccount(
    @Body() accountSetupDto: AccountSetupDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.setAccount(accountSetupDto, currentUser);
  }

  @Get('get-info-single')
  async getUserInfoHandler(@Query('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Put('update')
  async updateUserHandler(
    @Query('userId') userId: string,
    @Body() updatedUserContent: Partial<User>,
  ) {
    return await this.userService.updateUserById(userId, updatedUserContent);
  }

  @Get('admin/get-all')
  async getAllUsersHandler() {
    return await this.userService.getAllUsers();
  }
}
