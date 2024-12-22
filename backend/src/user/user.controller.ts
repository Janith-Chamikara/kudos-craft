import { Body, Controller, Post } from '@nestjs/common';
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
}
