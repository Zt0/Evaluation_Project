import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateUserDto} from '../dto/userCreateDto'
import {UpdateUserDto} from '../dto/userUpdateDto'
import {User} from '../entity/user'
import {dbAuth} from '../auth/preauthMiddleware'

@Injectable()
export class UserRepository {
  @InjectRepository(User)
  userRepository: Repository<User>

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['userSubCriteria', 'userSubCriteria.event'],
    })
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({
      relations: ['userSubCriteria', 'userSubCriteria.event'],
      where: {id},
    })
  }

  findOne(uid: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['userSubCriteria', 'userSubCriteria.event'],
      where: {authUid: uid},
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    })
    return this.userRepository.save(user)
  }

  async remove(id: number): Promise<User> {
    const removeUserId = await this.userRepository.findOne(id)
    await dbAuth.deleteUser(removeUserId.authUid)
    return this.userRepository.remove(removeUserId)
  }

  async changeSalary(id: number, salary: number): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      salary: salary
    });
    return this.userRepository.save(user);
  }

  async uploadImage(
    uid: string,
    public_id: string,
    url: string,
    id: number
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      avatar: url,
      avatarPublicId: public_id
    });
    return this.userRepository.save(user);
  }
}
