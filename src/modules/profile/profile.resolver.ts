import { Resolver } from '@nestjs/graphql';
import { ProfileServices } from './profile.service';
import { Query } from '@nestjs/graphql';
import { Auth, CurrentUser, Sys_Role, type IUser } from 'src/common';
import { UserProfileEntity } from './entities/profile.entity';
@Auth(Sys_Role.admin,Sys_Role.user,Sys_Role.company_admin)
@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileServices) {}
  @Query(() => UserProfileEntity, { name: 'getProfile' })
  async getProfile(@CurrentUser() user: IUser) {
      const profile = await this.profileService.getProfile(user);
      console.log(profile)
      return profile
  }
}
