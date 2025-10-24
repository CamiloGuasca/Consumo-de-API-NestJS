import { Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // GET /pokemon?limit&offset  -> paginado (PokéAPI)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.pokemonService.findAll(pagination);
  }

  // GET /pokemon/:id  -> por id (primero local, si no, PokéAPI)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findOne(id);
  }

  // POST /pokemon  -> crea en memoria (DTO de creación)
  @Post()
  create(@Body() dto: CreatePokemonDto) {
    return this.pokemonService.create(dto);
  }

  // PATCH /pokemon/:id  -> actualiza parcial en memoria (DTO parcial)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePokemonDto) {
    return this.pokemonService.update(id, dto);
  }

  // DELETE /pokemon/:id  -> elimina en memoria
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.remove(id);
  }
}
