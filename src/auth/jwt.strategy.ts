import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const JWT_GUARD = 'jwt-user';

export class JwtStrategy extends PassportStrategy(Strategy, JWT_GUARD) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  validate(payload: any) {
    return true;
  }
}
