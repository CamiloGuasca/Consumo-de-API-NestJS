import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import type { Personaje } from './models/personaje.model';1
import { CreatePersonajeDto } from './dto/crearPersonaje.dto';
import { UpdatePersonajeDto } from './dto/actPersonaje.dto';

const BASE_URL = 'https://www.swapi.tech/api';

@Injectable()
export class PersonajesService {
  private localPersonajes: Personaje[] = [];
  private nextUid = 900;
constructor(private readonly httpService: HttpService) {
}

async findAll(limit: number, offset: number): Promise<Personaje[]> {
    const url = `${BASE_URL}/people?page=${Math.floor(offset / limit) + 1}&limit=${limit}`;
    console.log(url);
    try {
        const responseObj = await firstValueFrom(
            this.httpService.get(url).pipe(
                catchError((error) => {
                    console.error('--- FALLO CRÍTICO DE LA API ---');
                    console.error('Código/Mensaje de Error:', error.response?.status, error.message);
                    throw new BadRequestException('Error al obtener datos de SWAPI');
                }),
            ),
        );

        const data = responseObj.data; 

         let fetchedPersonajes: Personaje[] = [];

        if (data && data.results) {
            fetchedPersonajes = data.results.map((p: any) => ({
                uid: p.uid,
                name: p.name,
                height: 'N/A',
                mass: 'N/A',
                hair_color: 'N/A',
                skin_color: 'N/A',
                eye_color: 'N/A',
                birth_year: 'N/A',
                gender: 'N/A',
            }));
        }else{
          console.error("ERROR DE ESTRUCTURA: 'data' no contiene 'results'.");
          console.log("Estructura de la data recibida:", data);
        }

        const allPersonajes = [...fetchedPersonajes, ...this.localPersonajes];
      
        return allPersonajes;
        
    } catch (e) {
        throw e;
    }
}
async findOne(id: string): Promise<Personaje> {
  
    const localPersonaje = this.localPersonajes.find((p) => p.uid === id);
    if (localPersonaje) {
      return localPersonaje;
    }

    const url = `${BASE_URL}/people/${id}`;

    try {

      const responseObj = await firstValueFrom(
        this.httpService.get(url).pipe(
     
          catchError((error) => {
            console.error('API Error:', error.message);
            
            if (error.response?.status === 404) {
                 throw new NotFoundException(`Personaje con ID ${id} no encontrado.`);
            }
            throw new BadRequestException('Error al obtener datos de SWAPI');
          }),
        ),
      );

 
      const data = responseObj.data; 

      
      if (!data || !data.result || !data.result.properties) {
        throw new NotFoundException(`Personaje con ID ${id} no encontrado.`);
      }

      const props = data.result.properties;

      const personaje: Personaje = {
        uid: data.result.uid,
        name: props.name,
        height: props.height,
        mass: props.mass,
        hair_color: props.hair_color,
        skin_color: props.skin_color,
        eye_color: props.eye_color,
        birth_year: props.birth_year,
        gender: props.gender,
      };

      return personaje;
    } catch (e) {
      throw e;
    }
  }

  create(createPersonajeDto: CreatePersonajeDto): Personaje {
    const newPersonaje: Personaje = {
      ...createPersonajeDto,
      uid: (this.nextUid++).toString(),
    };

    this.localPersonajes.push(newPersonaje);
    return newPersonaje;
  }

  update(id: string, updatePersonajeDto: UpdatePersonajeDto): Personaje {
    const index = this.localPersonajes.findIndex((p) => p.uid === id);

    if (index === -1) {
      throw new NotFoundException(
        `Personaje con ID ${id} no encontrado en los elementos creados localmente.`,
      );
    }

    const updatedPersonaje = {
      ...this.localPersonajes[index],
      ...updatePersonajeDto,
    };

    this.localPersonajes[index] = updatedPersonaje;
    return updatedPersonaje;
  }
  remove(id: string): Personaje {
    const index = this.localPersonajes.findIndex((p) => p.uid === id);

    if (index === -1) {
      throw new NotFoundException(
        `Personaje con ID ${id} no encontrado en los elementos creados localmente.`,
      );
    }

    const [deletedPersonaje] = this.localPersonajes.splice(index, 1);
    return deletedPersonaje;
  }
}