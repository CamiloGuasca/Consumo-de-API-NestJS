import { Module } from '@nestjs/common';
import { PersonajesService } from './personajes.service';
import { PersonajesController } from './personajes.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // 5 segundos
      maxRedirects: 5,
    }),
  ],
  controllers: [PersonajesController],
  providers: [PersonajesService],
})
export class PersonajesModule {}
