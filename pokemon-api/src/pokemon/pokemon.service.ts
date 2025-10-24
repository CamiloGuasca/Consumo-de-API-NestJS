import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from './dto/pagination.dto';
import { PokemonEntity } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly http: HttpService) {}

  private readonly BASE = 'https://pokeapi.co/api/v2/pokemon';//URL de pokemons

  // === SE cero un almacenamiento en memoria para simular POST/PATCH/DELETE ===
  private store = new Map<number, PokemonEntity>();
  private nextId = 10000; // ids simulados para distinguir de PokéAPI

  // GET paginado (real desde PokéAPI)
  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${this.BASE}?limit=${limit}&offset=${offset}`)
      );
      return data;
    } catch (error) {
      throw new BadRequestException('Error al obtener la lista de Pokémon');
    }
  }

  // GET por id: primero busca en el store local; si no, lo pide a PokéAPI
  async findOne(id: number): Promise<PokemonEntity> {
    const local = this.store.get(id);
    if (local) return local;

    try {
      const { data } = await firstValueFrom(this.http.get(`${this.BASE}/${id}`));
      // mapeo mínimo a nuestra entidad
      const mapped: PokemonEntity = {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
      };
      return mapped;
    } catch (error) {
      throw new NotFoundException(`Pokémon ${id} no encontrado`);
    }
  }

  // POST (simulado en memoria)
  async create(dto: CreatePokemonDto): Promise<PokemonEntity> {
    const created: PokemonEntity = {
      id: this.nextId++,
      name: dto.name,
      height: dto.height,
      weight: dto.weight,
    };
    this.store.set(created.id, created);
    return created;
  }

  // PATCH (simulado en memoria)
  async update(id: number, dto: UpdatePokemonDto): Promise<PokemonEntity> {
    const current = this.store.get(id);
    if (!current) {
      // Solo se permutian PATCH sobre recursos creados localmente
      // (los reales de PokéAPI son de solo lectura)
      throw new NotFoundException(`Pokémon local ${id} no encontrado para actualizar`);
    }
    const updated: PokemonEntity = { ...current, ...dto };
    this.store.set(id, updated);
    return updated;
  }

  // DELETE (simulado en memoria)
  async remove(id: number): Promise<{ deleted: boolean; id: number }> {
    const existed = this.store.has(id);
    if (!existed) {
      throw new NotFoundException(`Pokémon local ${id} no encontrado para eliminar`);
    }
    this.store.delete(id);
    return { deleted: true, id };
  }
}
