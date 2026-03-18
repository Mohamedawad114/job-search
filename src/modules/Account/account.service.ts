import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {  HashingService, IUser, UserRepository } from 'src/common';
import {
  EmailProducer,
  redis,
  redisKeys,
  s3_services,
  TokenServices,
} from 'src/common/Utils/services/index';
import{File,emailType} from 'src/common/Enum'
import { Request, Response } from 'express';
import {
  ResetPasswordDto,
  updatePasswordDto,
  UpdateUploadDto,
  uploadDto,
} from './Dto';
@Injectable()
export class AccountServices {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly HashService: HashingService,
    private readonly TokenServices: TokenServices,
    private readonly emailQueue: EmailProducer,
    private readonly s3service: s3_services,
  ) {}

  updatePassword = async (
    Dto: updatePasswordDto,
    user: IUser,
    res: Response,
  ) => {
    if (!user) throw new NotFoundException('user not found');
    const isMatch = await this.HashService.compare_hash(
      Dto.oldPassword,
      user?.password as string,
    );
    if (!isMatch) throw new BadRequestException(`invalid oldPassword`);
    user.password = Dto.confirmPassword;
    await this.userRepo.updateById(user.id, { password: Dto.confirmPassword });
    const keys = await redis.keys(redisKeys.refreshToken(user.id, '*'));
    if (keys.length) await redis.del(...keys);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { message: 'password updated successfully' };
  };
  resetPasswordReq = async (user: IUser) => {
    this.emailQueue.sendEmailJob(emailType.resetPassword, user.email);
    return { message: `OTP is sent` };
  };
  async resendOTP_reset(user: IUser) {
    this.emailQueue.sendEmailJob(emailType.resetPassword, user.email);
    return { message: `OTP is sent` };
  }
  resetPasswordConfirm = async (
    user: IUser,
    Dto: ResetPasswordDto,
    res: Response,
  ) => {
    if (!user) throw new BadRequestException('user not found');
    const savedOTP = await redis.get(redisKeys.resetPassword(user.email));
    if (!savedOTP) throw new BadRequestException(`expire OTP.`);
    const isMatch = await this.HashService.compare_hash(Dto.OTP, savedOTP);
    if (!isMatch) throw new BadRequestException(`Invalid OTP`);

    await redis.del(redisKeys.resetPassword(user.email));
    await this.userRepo.updateById(user.id, {
      password: Dto.confirmPassword,
    });
    const keys = await redis.keys(redisKeys.refreshToken(user.id, '*'));
    if (keys.length) await redis.del(...keys);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { message: 'password reset successfully' };
  };
  upload = async (user: IUser, type: uploadDto) => {
    const userId = user.id;
    let key: string = '';
    if (type.file == File.image) key = `users/${userId}`;
    key = `users/${userId}/cv`;
    const { Key, url } = await this.s3service.upload_file(key);
    return { message: 'upload url generated', data: { Key, url } };
  };

  updateUpload = async (Dto: UpdateUploadDto, user: IUser) => {
    const { key } = Dto;
    const { uploaded } = await this.s3service.verifyUpload(key);
    if (!uploaded) throw new BadRequestException('file not uploaded');
    let result: {};
    let updated;
    if (key.includes('cv')) {
      if (user.CV) await this.s3service.deleteFile(user?.CV);
      updated = await this.userRepo.updateById(user.id, {
        CV: key,
      });
      result = {
        message: 'cv uploaded',
        data: updated,
      };
    } else {
      if (user.profilePicture)
        await this.s3service.deleteFile(user?.profilePicture);
      updated = await this.userRepo.updateById(user.id, {
        profilePicture: key,
      });
      result = {
        message: 'profile image uploaded',
        data: updated,
      };
    }
    return {
      result,
    };
  };
  logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new BadRequestException('no refresh token found');
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) throw new UnauthorizedException('no token provided');
    const decoded = this.TokenServices.VerifyRefreshToken(token);
    await redis.del(redisKeys.refreshToken(decoded.id, decoded.jti));
    await redis.set(redisKeys.token_blackList(accessToken), '0', 'EX', 60 * 30);
    res.clearCookie('refreshToken');
    return;
  };
}
