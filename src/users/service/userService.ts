import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import {CreateUserDto} from '../dto/userCreateDto'
import {UpdateUserDto} from '../dto/userUpdateDto'
import {User} from '../entity/user'
import {logger} from '../../logger'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CloudinaryService} from '../../cloudinary/cloudinaryService'
import {dbAuth} from '../auth/preauthMiddleware'
import {NotFoundException} from '@nestjs/common'
import {UserRepository} from '../repository/userRepository'
import {UserSalaryDto} from '../dto/userSalaryDto'
import {AddUserDto} from '../dto/addUserDto'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authGet } from '../auth/connection';
import { UserSignInDto } from '../dto/userSignInDto';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  private cloudinary: CloudinaryService;

  @Inject()
  usersRepository: UserRepository;

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const auth = await dbAuth.createUser({
        email: createUserDto.email,
        password: createUserDto.password
      });
      createUserDto.authUid = auth.uid;
      createUserDto.avatar = process.env.AVATAR_URL;
      const data = await signInWithEmailAndPassword(
        authGet,
        createUserDto.email,
        createUserDto.password
      );
      await this.usersRepository.create(createUserDto);
      return data.user['stsTokenManager'].accessToken;
    } catch (err) {
      throw new BadRequestException(`Method Not Allowed`);
    }
  }

  async findAll(
    limit = 10,
    page = 0
  ): Promise<{ data: User[]; count: number }> {
    if (limit > 100) {
      throw new BadRequestException('Pagination limit exceeded');
    }
    return this.usersRepository.findAll(limit, page);
  }

  async findOneById(id: number): Promise<User> {
    let user;
    try {
      user = await this.usersRepository.findOneById(id);
    } catch (error) {
      logger.error(`User with ID=${id} not found ${error}`);
    }
    return user;
  }

  async findOne(authUid: string): Promise<User> {
    try {
      return this.usersRepository.findOne(authUid)
    } catch (err) {
      throw new NotFoundException(`User with ID=${authUid} not found`)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.update(id, updateUserDto);
      await dbAuth.updateUser(user.authUid, { email: updateUserDto.email });
      return user;
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneById(id);
      await dbAuth.deleteUser(user.authUid);
      return await this.usersRepository.remove(id);
    } catch (err) {
      throw {
        statusCode: 404,
        message: `User with ID=${id} not found`
      };
    }
  }

  async changeSalary(id: number, userSalaryDto: UserSalaryDto): Promise<User> {
    try {
      return this.usersRepository.changeSalary(id, userSalaryDto);
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, uid: string) {
    try {
      const user = await this.usersRepository.findOne(uid);
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImg(user.avatarPublicId);
      }
      const cloudinaryRes = await this.cloudinary.uploadImage(file);
      return this.usersRepository.uploadImage(
        uid,
        cloudinaryRes.public_id,
        cloudinaryRes.url,
        user.id
      );
    } catch (err) {
      throw new NotFoundException(`file is not found`);
    }
  }

  async userDeactivate(id: number) {
    try {
      const user = await this.usersRepository.findOneById(id);
      const authUser = await dbAuth.getUser(user.authUid);
      if (authUser.disabled) {
        await dbAuth.updateUser(user.authUid, {
          disabled: false
        });
      } else {
        await dbAuth.updateUser(user.authUid, {
          disabled: true
        });
      }
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }

  async addUser(addUserDto: AddUserDto): Promise<User> {
    try {
      const auth = await dbAuth.createUser({
        email: addUserDto.email,
      })
      addUserDto.authUid = auth.uid
      addUserDto.avatar = process.env.AVATAR_URL;
      return await this.usersRepository.addUser(addUserDto);
    } catch (err) {
      throw new BadRequestException(`Method Not Allowed`);
    }
  }

  async signIn(userSignInDto: UserSignInDto): Promise<User> {
    try {
      const data = await signInWithEmailAndPassword(
        authGet,
        userSignInDto.email,
        userSignInDto.password
      );
      return data.user['stsTokenManager'].accessToken;
    } catch (err) {
      throw new UnauthorizedException(
        `Login Failed: Your user email or password is incorrect`
      );
    }
  }
}
