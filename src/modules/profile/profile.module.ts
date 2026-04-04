import { Module } from '@nestjs/common';
import { ProfileServices } from './profile.service';
import { ProfileController } from './profile.controller';

import {
  CompanyRepository,
  CryptoService,
  EducationRepository,
  ExperienceRepository,
  HashingService,
  SkillRepository,
  UserRepository,
  UserSkillRepository,
} from 'src/common';
import { EmailModule, s3_services } from 'src/common/Utils/services';
import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [EmailModule],
  providers: [
    ProfileServices,
    UserRepository,
    ExperienceRepository,
    EducationRepository,
    SkillRepository,
    UserSkillRepository,
    CryptoService,
    HashingService,
    s3_services,
    CompanyRepository,
    ProfileResolver
  ],
  controllers: [ProfileController],
  exports: [],
})
export class ProfileModule {}
