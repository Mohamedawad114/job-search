export interface EmailData {
    sendEmail(to: string, subject: string, template: string): Promise<void>;
}
