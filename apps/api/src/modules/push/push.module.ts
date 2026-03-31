import { Module } from '@nestjs/common';
import { PushWorker } from './push.worker';

@Module({
  providers: [PushWorker],
  exports: [PushWorker],
})
export class PushModule {}
