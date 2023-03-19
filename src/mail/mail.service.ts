import { HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailInterface, ResponseStatus } from './types/interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async accountActivationMail(user: IMailInterface): Promise<any> {
    const { accessToken, email, firstName, lastName } = user;
    const url = `${process.env.CLIENT_URL}/activate/token?=${accessToken}`;
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Account Confirmation',
      template: 'activation',

      context: {
        name: `${firstName} ${lastName}`,
        url,
        email,
      },
    });
  }

  async passwordResetMail(user: IMailInterface): Promise<ResponseStatus> {
    const { accessToken, email, firstName, lastName } = user;
    const url = `${process.env.CLIENT_URL}/reset/token?=${accessToken}`;
    const res = await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: 'reset',

      context: {
        name: `${firstName} ${lastName}`,
        url,
      },
    });
    if (res) {
      return {
        message: `Check ${email} for reset link`,
        statusCode: HttpStatus.OK,
      };
    }
  }
}
