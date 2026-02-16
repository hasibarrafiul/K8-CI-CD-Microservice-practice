import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices'; // For RabbitMQ
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredential } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCredential)
    private readonly authRepo: Repository<AuthCredential>,
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.authRepo.findOne({ where: { email } });
      
      if (user && await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }

  // 2. Login Logic (Generate Token)
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // SAVE TO ACTUAL POSTGRES TABLE
    const newUser = await this.authRepo.save({
      email: dto.email,
      password: hashedPassword,
    });

    this.client.emit('user_created', { 
      userId: newUser.id, 
      email: newUser.email 
    });

    return { message: 'User saved to DB', user: { id: newUser.id, email: newUser.email } };
  }
}