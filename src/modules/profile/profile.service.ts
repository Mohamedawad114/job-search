import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyRepository,
  CryptoService,
  EducationRepository,
  emailType,
  ExperienceRepository,
  IUser,
  SkillRepository,
  Sys_Role,
  UserRepository,
  UserSkillRepository,
} from 'src/common';
import {
  AddEducationDto,
  UpdateProfileDto,
  updateEducationDto,
  AddExperienceDto,
  UpdateExperienceDto,
  AddUserSkill,
  UpdateUserSkill,
} from './Dto';
import { EmailProducer, s3_services } from 'src/common/Utils/services';

@Injectable()
export class ProfileServices {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly crypto: CryptoService,
    private readonly emailQueue: EmailProducer,
    private readonly educationRepo: EducationRepository,
    private readonly experienceRepo: ExperienceRepository,
    private readonly s3service: s3_services,
    private readonly userSkillRepo: UserSkillRepository,
    private readonly skillRepo: SkillRepository,
    private readonly companyRepo: CompanyRepository,
  ) {}

  getProfile = async (user: IUser) => {
    const userProfile = await this.userRepo.findOne(
      {
        id: user.id,
      },
      {
        include: {
          education: true,
          experiences: true,
        },
      },
    );
    const phone = user?.phoneNumber
      ? this.crypto.decryption(user.phoneNumber)
      : null;
    userProfile.phoneNumber = phone;

    return userProfile;
  };
  updateProfile = async (Dto: UpdateProfileDto, user: IUser) => {
    const data: any = { ...Dto };
    if (Dto.email && Dto.email !== user.email) {
      const emailExists = await this.userRepo.findByEmail(Dto.email);
      if (emailExists) {
        throw new ConflictException(`email already existed`);
      }
      data.isConfirmed = false;
      await this.emailQueue.sendEmailJob(emailType.confirmation, Dto.email);
    }
    if (Dto.phoneNumber)
      data.phoneNumber = this.crypto.encryption(Dto.phoneNumber);
    if ('companyId' in Dto) {
      if (Dto.companyId) {
        const company = await this.companyRepo.findById(Dto.companyId);
        if (!company) throw new NotFoundException('company not found');
        if (user.role === Sys_Role.company_admin && company.adminId === user.id)
          throw new BadRequestException(
            "can't change companyId before change the company admin",
          );
        data.company = { connect: { id: Dto.companyId } };
      } else if (Dto.companyId === null) {
        data.company = { disconnect: true };
      }
    }
    const updatedUser = await this.userRepo.updateById(user.id, data);
    if (!updatedUser) throw new BadRequestException(`something wrong`);
    return { message: 'user updated successfully', data: { updatedUser } };
  };

  getProfilePic = async (user: IUser) => {
    if (!user.profilePicture) throw new BadRequestException('no profile Image');
    const url = await this.s3service.getSignedUrl(user.profilePicture);
    return {
      message: 'profile picture ',
      data: { profilePicture: url },
    };
  };

  addEducation = async (user: IUser, Dto: AddEducationDto) => {
    const userEdu = await this.educationRepo.findOne({
      userId: user.id,
    });
    if (userEdu) throw new ConflictException('user education already exist');
    const start = new Date(Dto.startDate);
    if (start > new Date())
      throw new BadRequestException('enter a correct date');
    const data = {
      ...Dto,
      user: {
        connect: { id: user.id },
      },
    };
    const created = await this.educationRepo.create({ ...data });
    return {
      message: 'user education added',
      data: created,
    };
  };
  updateEducation = async (user: IUser, Dto: updateEducationDto) => {
    const userEdu = await this.educationRepo.findOne({ userId: user.id });
    if (!userEdu) throw new NotFoundException('user education not exist');
    const data = {
      ...Dto,
    };
    const updated = await this.educationRepo.updateById(userEdu.id, data);
    return {
      message: 'user education updated',
      data: updated,
    };
  };
  deleteEducation = async (user: IUser) => {
    const userEdu = await this.educationRepo.findOne({ userId: user.id });
    if (!userEdu) throw new NotFoundException('user education not exist');
    await this.educationRepo.delete({ userId: user.id });
    return { message: 'education deleted' };
  };

  addExperience = async (user: IUser, Dto: AddExperienceDto) => {
    const start = new Date(Dto.startDate);
    if (start > new Date())
      throw new BadRequestException('enter a correct date');
    const data = {
      ...Dto,
      user: {
        connect: { id: user.id },
      },
    };
    const created = await this.experienceRepo.create({ ...data });
    return {
      message: 'user experience added',
      data: created,
    };
  };
  updateExperience = async (
    user: IUser,
    Dto: UpdateExperienceDto,
    expId: number,
  ) => {
    if (!expId) throw new BadRequestException('experience id required');
    const userExp = await this.experienceRepo.findOne({
      userId: user.id,
      id: expId,
    });
    if (!userExp) throw new NotFoundException('user experience not found');
    const data = {
      ...Dto,
    };
    const updated = await this.experienceRepo.updateById(expId, data);
    return {
      message: 'user experience updated',
      data: updated,
    };
  };
  deleteExperience = async (user: IUser, expId: number) => {
    if (!expId) throw new BadRequestException('experience id required');
    const userExp = await this.experienceRepo.findOne({
      userId: user.id,
      id: expId,
    });
    if (!userExp) throw new NotFoundException('user experience not found');
    await this.experienceRepo.delete({ userId: user.id, id: expId });
    return { message: 'experience deleted' };
  };
  addUserSkill = async (user: IUser, Dto: AddUserSkill) => {
    const IsSkillExist = await this.skillRepo.findById(Dto.skillId);
    if (!IsSkillExist) throw new NotFoundException('skill not exist');
    const existing = await this.userSkillRepo.findOneUSerSkill({
      skillId: Dto.skillId,
      userId: user.id,
    });
    if (existing) throw new ConflictException('skill already added');
    const data = {
      level: Dto.level,
      skill: {
        connect: {
          id: Dto.skillId,
        },
      },
      user: {
        connect: { id: user.id },
      },
    };
    const userSkill = await this.userSkillRepo.create(data);
    if (userSkill)
      return {
        message: 'skill added',
        data: userSkill,
      };
  };
  updateUserSkill = async (
    user: IUser,
    Dto: UpdateUserSkill,
    skillId: number,
  ) => {
    const IsSkillExist = await this.userSkillRepo.findOne({
      id: skillId,
      userId: user.id,
    });
    if (!IsSkillExist) throw new NotFoundException('skill not exist');
    const updated = await this.userSkillRepo.updateById(skillId, {
      level: Dto.level,
    });
    if (updated)
      return {
        message: 'skill level updated',
      };
  };
  deleteUserSkill = async (user: IUser, skillId: number) => {
    const IsSkillExist = await this.userSkillRepo.findOne({
      id: skillId,
      userId: user.id,
    });
    if (!IsSkillExist) throw new NotFoundException('skill not exist');
    const deleted = await this.userSkillRepo.delete({
      userId: user.id,
      id: skillId,
    });
    if (deleted)
      return {
        message: 'skill deleted',
      };
  };
}
