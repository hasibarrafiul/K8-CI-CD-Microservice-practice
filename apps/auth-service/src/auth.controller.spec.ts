import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Create Mocks so we don't need real RabbitMQ or DB
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
    validateUser: jest.fn().mockResolvedValue({ id: 1, email: 'hasib@tokyo.com' }),
    register: jest.fn().mockResolvedValue({ message: 'User registered' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Inject the mock instead of the real service
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto = { email: 'hasib@tokyo.com', password: 'password123' };
      const result = await authController.login(loginDto);
      
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { email: 'new@tokyo.com', password: 'password123' };
      const result = await authController.register(registerDto);
      
      expect(result).toEqual({ message: 'User registered' });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});