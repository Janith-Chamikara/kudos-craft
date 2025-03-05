import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountSetupDto } from '../dto/user-account-setup.dto';
import { User } from '@prisma/client';
import { WorkspaceService } from 'src/workspace/services/workspace.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async setAccount(accountSetupDto: AccountSetupDto, currentUser: User) {
    console.log(accountSetupDto);
    if (accountSetupDto.usage === 'PERSONAL') {
      const jobField = accountSetupDto?.jobField;
      currentUser.job = jobField;
      await this.updateUserById(currentUser.id, currentUser);
    } else {
      const companyName = accountSetupDto.companyName;
      const industryType = accountSetupDto.industryType;
      const numberOfEmployees = accountSetupDto.numberOfEmployees;

      await this.updateUserById(currentUser.id, {
        usage: 'business',
        companyName,
        industryType,
        numberOfEmployees,
      });
    }
    //workspace
    const workspaceName = accountSetupDto.workspace.name;
    const workspaceDetails = accountSetupDto.workspace.description;
    const workspace = await this.workspaceService.createWorkspace({
      name: workspaceName,
      description: workspaceDetails,
      ownerId: currentUser.id,
    });
    currentUser.isInitialSetupCompleted = true;
    await this.updateUserById(currentUser.id, {
      isInitialSetupCompleted: true,
    });
    return {
      workspace,
      message: 'Congratulations! Your account has been successfully set up.',
    };
  }

  async getUserById(id: string) {
    const isUserExists = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!isUserExists) {
      throw new BadRequestException('User with the provided id does not exist');
    }
    return isUserExists;
  }

  async updateUserById(id: string, updatedUserContent: Partial<User>) {
    const isUserExists = await this.getUserById(id);
    if (!isUserExists) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: isUserExists.id,
      },
      data: updatedUserContent,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Error occurred during updating user',
      );
    }
    return updatedUser;
  }

  async deleteUserById(userId: string) {
    if (!userId) {
      throw new NotFoundException('Cannot find user Id');
    }

    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        ownerId: userId,
      },
    });

    if (workspaces.length > 0) {
      await this.prismaService.testimonial.deleteMany({
        where: {
          workspaceId: {
            in: workspaces.map((workspace) => workspace.id),
          },
        },
      });
    }

    await this.prismaService.workspace.deleteMany({
      where: {
        ownerId: userId,
      },
    });

    return await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }
}
