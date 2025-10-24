import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonajeDto } from './crearPersonaje.dto';

export class UpdatePersonajeDto extends PartialType(CreatePersonajeDto) {}