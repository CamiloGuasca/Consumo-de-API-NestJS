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
  private localPersonajes: Personaje[] = []; // 👈 Simulación de DB para el CRUD local
  private nextUid = 900; // ID inicial para elementos creados (mayor que los de la API)

  
  //constructor(private readonly httpService: HttpService) {}
constructor(private readonly httpService: HttpService) {
}
// En PersonajesService.ts

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
                // Asignamos 'N/A' o valores por defecto para completar el modelo Personaje
                height: 'N/A',
                mass: 'N/A',
                hair_color: 'N/A',
                skin_color: 'N/A',
                eye_color: 'N/A',
                birth_year: 'N/A',
                gender: 'N/A',
            }));
        }else{
          console.error("❌ ERROR DE ESTRUCTURA: 'data' no contiene 'results'.");
          console.log("Estructura de la data recibida:", data);
        }

        const allPersonajes = [...fetchedPersonajes, ...this.localPersonajes];
        
        // Retorna el array completo si hemos tenido problemas con el slice
        return allPersonajes;
        
    } catch (e) {
        throw e;
    }
}

  // ------------------------------------------------------------------
  // 2. GET /elementos/id (Obtener por ID)
  // ------------------------------------------------------------------
 // En PersonajesService.ts

async findOne(id: string): Promise<Personaje> {
    // 1. Buscar en la DB local
    const localPersonaje = this.localPersonajes.find((p) => p.uid === id);
    if (localPersonaje) {
      return localPersonaje;
    }

    // 2. Buscar en la API externa
    const url = `${BASE_URL}/people/${id}`;

    try {
      // Capturamos la respuesta completa, no solo { data }
      const responseObj = await firstValueFrom(
        this.httpService.get(url).pipe(
          // ELIMINAMOS el map((response) => response.data)
          catchError((error) => {
            console.error('API Error:', error.message);
            // Si el error es 404 de SWAPI, lanzamos NotFound
            if (error.response?.status === 404) {
                 throw new NotFoundException(`Personaje con ID ${id} no encontrado.`);
            }
            throw new BadRequestException('Error al obtener datos de SWAPI');
          }),
        ),
      );

      // Extraemos la data manualmente
      const data = responseObj.data; 

      // Verificamos si la respuesta tiene la estructura esperada
      if (!data || !data.result || !data.result.properties) {
        throw new NotFoundException(`Personaje con ID ${id} no encontrado.`);
      }

      // Mapear la respuesta completa
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
      // Manejamos cualquier error lanzado (NotFound o BadRequest)
      throw e;
    }
  }

  // ------------------------------------------------------------------
  // 3. POST /elementos (Crear - Simulado)
  // ------------------------------------------------------------------
  create(createPersonajeDto: CreatePersonajeDto): Personaje {
    const newPersonaje: Personaje = {
      ...createPersonajeDto,
      uid: (this.nextUid++).toString(), // Asignar nuevo ID simulado
    };

    this.localPersonajes.push(newPersonaje);
    return newPersonaje;
  }

  // ------------------------------------------------------------------
  // 4. PATCH /elementos/id (Actualizar Parcialmente - Simulado)
  // ------------------------------------------------------------------
  update(id: string, updatePersonajeDto: UpdatePersonajeDto): Personaje {
    const index = this.localPersonajes.findIndex((p) => p.uid === id);

    if (index === -1) {
      // Solo se pueden modificar elementos creados localmente
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

  // ------------------------------------------------------------------
  // 5. DELETE /elementos/id (Eliminar - Simulado)
  // ------------------------------------------------------------------
  remove(id: string): Personaje {
    const index = this.localPersonajes.findIndex((p) => p.uid === id);

    if (index === -1) {
      // Solo se pueden eliminar elementos creados localmente
      throw new NotFoundException(
        `Personaje con ID ${id} no encontrado en los elementos creados localmente.`,
      );
    }

    const [deletedPersonaje] = this.localPersonajes.splice(index, 1);
    return deletedPersonaje;
  }
}