import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  create(createAuthDto: CreateAuthDto) {
    return {
      token: this.jwtService.sign({
        id: 1,
      }),
    };
  }
}
