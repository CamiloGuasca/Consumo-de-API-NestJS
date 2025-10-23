import { Module } from '@nestjs/common';

import { PersonajesModule } from './personajes/personajes.module';

@Module({
  imports: [PersonajesModule]
})
export class AppModule {}
