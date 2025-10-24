import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe,} from '@nestjs/common';
import { PersonajesService } from './personajes.service';
import { CreatePersonajeDto } from './dto/crearPersonaje.dto';
import { UpdatePersonajeDto } from './dto/actPersonaje.dto';
import type { Personaje } from './models/personaje.model';

@Controller('personajes')
export class PersonajesController {
    constructor(private readonly personajesService: PersonajesService) {}

    @Post()
    create(@Body() createPersonajeDto: CreatePersonajeDto): Personaje {
        return this.personajesService.create(createPersonajeDto);
    }

    @Get()
    async findAll(
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 100,
        @Query('offset', new ParseIntPipe({ optional: true })) offset = 0,
    ): Promise<Personaje[]> {
        return this.personajesService.findAll(limit, offset);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Personaje> {
        return this.personajesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePersonajeDto: UpdatePersonajeDto,
    ): Personaje {
        return this.personajesService.update(id, updatePersonajeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Personaje {
        return this.personajesService.remove(id);
    }
}
