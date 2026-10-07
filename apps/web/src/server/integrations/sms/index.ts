import * as fs from 'fs';
import * as path from 'path';

export interface SmsSendParams {
  to: string;
  templateId?: string;
  variables: Record<string, string>;
}

export interface SmsProvider {
  send(params: SmsSendParams): Promise<void>;
}

class CaptureSmsProvider implements SmsProvider {
  async send(params: SmsSendParams): Promise<void> {
    const outboxDir = path.join(process.cwd(), '.tmp');
    if (!fs.existsSync(outboxDir)) {
      fs.mkdirSync(outboxDir, { recursive: true });
    }
    const outboxPath = path.join(outboxDir, 'sms-outbox.jsonl');
    const logEntry = JSON.stringify({ ...params, timestamp: new Date().toISOString() }) + '\n';
    fs.appendFileSync(outboxPath, logEntry, 'utf8');
  }
}

class Fast2SmsProvider implements SmsProvider {
  async send(params: SmsSendParams): Promise<void> {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      throw new Error('FAST2SMS_API_KEY is missing');
    }
    // Fast2SMS expects 10 digit number
    const toPhone = params.to.replace('+91', '');
    // Using a default route/variables logic for OTP
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: params.variables.otp,
        numbers: toPhone
      })
    });

    const data = await response.json();
    if (!data.return) {
      throw new Error(data.message || 'Fast2SMS error');
    }
  }
}

export const sms: SmsProvider = 
  process.env.SMS_PROVIDER === 'capture' && process.env.NODE_ENV !== 'production'
    ? new CaptureSmsProvider()
    : new Fast2SmsProvider();
