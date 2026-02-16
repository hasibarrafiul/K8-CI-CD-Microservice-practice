import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // Mocking the UserService logic
  const mockUserService = {
    createProfile: jest.fn().mockImplementation((data) => {
      return { ...data, bio: 'Mock Bio' };
    }),
    searchUsers: jest.fn().mockImplementation((query) => {
      return [{ email: 'hasib@tokyo.com', bio: 'Full Stack Engineer' }];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('handleUserCreated (Event Pattern)', () => {
    it('should call createProfile when user_created event is received', async () => {
      const payload = { userId: 123, email: 'test@example.com' };
      await userController.handleUserCreated(payload);
      
      expect(userService.createProfile).toHaveBeenCalledWith(payload);
    });
  });

  describe('search (REST API)', () => {
    it('should return an array of users based on search query', async () => {
      const query = 'hasib';
      const result = await userController.search(query);
      
      expect(result).toEqual([{ email: 'hasib@tokyo.com', bio: 'Full Stack Engineer' }]);
      expect(userService.searchUsers).toHaveBeenCalledWith(query);
    });
  });
});