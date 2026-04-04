import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Res,
  Req,
  Query,
  HttpCode,
} from '@nestjs/common';
import { Sys_Role } from '@prisma/client';
import { type IUser } from 'src/common';
import { Auth, AuthUser} from 'src/common/decorator'
import {
  ResetPasswordDto,
  updatePasswordDto,
  UpdateUploadDto,
  uploadDto,
} from './Dto';
import type { Request, Response } from 'express';
import { AccountServices } from './account.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Auth(Sys_Role.user, Sys_Role.admin, Sys_Role.company_admin)
@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountServices) {}

  @Get('upload')
  @ApiOperation({ summary: 'Get upload profile picture data (presigned URL)' })
  @ApiQuery({ type: uploadDto })
  async UploadPic(@AuthUser() user: IUser, @Query() type: uploadDto) {
    return await this.accountService.upload(user, type);
  }
  @Get('reset-passwordReq')
  @ApiOperation({ summary: 'Request password reset OTP' })
  async resetPasswordReq(@AuthUser() user: IUser) {
    return await this.accountService.resetPasswordReq(user);
  }

  @Get('resend-OTP-reset')
  @ApiOperation({ summary: 'Resend reset password OTP' })
  async resendOTP_reset(@AuthUser() user: IUser) {
    return await this.accountService.resendOTP_reset(user);
  }
  @Patch('update-password')
  @ApiOperation({ summary: 'Update current password' })
  @ApiBody({ type: updatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiBadRequestResponse({ description: 'invalid old Password' })
  async updatePassword(
    @AuthUser() user: IUser,
    @Body() dto: updatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.accountService.updatePassword(dto, user, res);
  }
  @Patch('reset-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Confirm password reset with OTP & delete refresh token',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Invalid OTP or OTP expired' })
  async resetPassword(
    @AuthUser() user: IUser,
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.accountService.resetPasswordConfirm(user, dto, res);
  }

  @Patch('update-profile-picture')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update profile picture' })
  @ApiBody({ type: UpdateUploadDto })
  async updateUpload(@AuthUser() user: IUser, @Body() dto: UpdateUploadDto) {
    return await this.accountService.updateUpload(dto, user);
  }

  @Delete('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout from current device' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.accountService.logout(req, res);
  }
}
