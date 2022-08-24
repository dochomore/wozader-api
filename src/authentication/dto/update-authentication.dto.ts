import { PartialType } from '@nestjs/mapped-types';
import { AuthDto } from './create-authentication.dto';

export class UpdateAuthenticationDto extends PartialType(AuthDto) {}
