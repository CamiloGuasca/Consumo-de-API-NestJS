import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePersonajeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  height: string;

  @IsNotEmpty()
  @IsString()
  mass: string;

  @IsNotEmpty()
  @IsString()
  hair_color: string;

  @IsNotEmpty()
  @IsString()
  skin_color: string;

  @IsNotEmpty()
  @IsString()
  eye_color: string;

  @IsNotEmpty()
  @IsString()
  birth_year: string;

  @IsNotEmpty()
  @IsString()
  gender: string;
}