import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Placeholder for FCM/APNs. Wire Firebase Admin or SNS; never log PHI tokens in prod.
 */
@Injectable()
export class PushWorker {
  private readonly logger = new Logger(PushWorker.name);

  constructor(private readonly config: ConfigService) {}

  async sendTestPush(deviceToken: string, title: string, body: string) {
    const enabled = this.config.get('FCM_ENABLED') === 'true';
    if (!enabled) {
      this.logger.warn(`Push skipped (FCM_ENABLED!=true): ${title}`);
      return { delivered: false, reason: 'disabled' };
    }
    this.logger.log(`Would send push to token ending ...${deviceToken.slice(-6)}`);
    return { delivered: true, stub: true };
  }
}
