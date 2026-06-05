import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //pega o authorization: bearer token
      ignoreExpiration: false,
      secretOrKey: 'wave-secret', //pegando a chave secreta de authmodule
    });
  }

  async validate(payload: any) { //payload é o que foi colocado no login
    return {
      login: payload.sub,
      role: payload.role,
    };
  }
}