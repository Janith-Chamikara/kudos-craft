import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto, BulkEmailDto } from './dto/email.dto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        family: 4,
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        secure: this.configService.get<boolean>('SMTP_SECURE', false),
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
      } as any);

      await this.transporter.verify();
      this.logger.log('Email service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email service', error.stack);
      throw new Error('Email service initialization failed');
    }
  }

  async sendEmail(emailData: SendEmailDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM_EMAIL'),
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
        attachments: emailData.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error('Failed to send email');
    }
  }

  async sendBulkEmails(emailData: BulkEmailDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM_EMAIL'),
        bcc: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
        attachments: emailData.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Bulk email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send bulk email: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to send bulk email');
    }
  }

  async getRenderedTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      const templatePath = join(
        process.cwd(),
        'src',
        'email',
        'email-templates',
        `${templateName}.html`,
      );
      const templateContent = await readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template(context);
    } catch (error) {
      this.logger.error(
        `Failed to render template: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to render email template');
    }
  }

  async sendTemplatedEmail(
    to: string | string[],
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<boolean> {
    try {
      const html = await this.getRenderedTemplate(templateName, context);
      const isBulk = Array.isArray(to);

      if (isBulk) {
        return await this.sendBulkEmails({
          to: to as string[],
          subject,
          html,
        });
      } else {
        return await this.sendEmail({
          to: to as string,
          subject,
          html,
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to send templated email: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to send templated email');
    }
  }
}
