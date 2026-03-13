import { Module } from '@nestjs/common';
import { ProfileServices } from './profile.service';
import { ProfileController } from './profile.controller';

import {
  CompanyRepository,
  CryptoService,
  EducationRepository,
  EmailModule,
  ExperienceRepository,
  HashingService,
  s3_services,
  SkillRepository,
  UserRepository,
  UserSkillRepository,
} from 'src/common';

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
  ],
  controllers: [ProfileController],
  exports: [],
})
export class ProfileModule {}
