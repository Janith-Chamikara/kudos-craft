export class SendEmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
}

export class BulkEmailDto {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
}
