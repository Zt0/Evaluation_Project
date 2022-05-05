import {Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, Column} from 'typeorm'
import {Event, EventDto} from './event'
import {Criteria, CriteriaDto} from './criteria'
import {IUserSubCriteria} from '../interface/userSubCriteriaInterface'
import {Rating, RatingDto} from './rating'
import {SubCriteria, SubCriteriaDto} from './subCriteria'
import {User, UserDto} from '../../users/entity/user'
import {IUserSubCriteriaGetDto} from '../interface/userSubCriteriaGetDtoInterface'

@Entity()
export class UserSubCriteria implements IUserSubCriteria {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn()
  eventId: number

  @PrimaryColumn()
  criteriaId: number

  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  evaluatorId: number

  @PrimaryColumn()
  evaluateeId: number

  @PrimaryColumn()
  subCriteriaId: number

  @PrimaryColumn()
  ratingId: number

  @Column()
  subCriteriaResult: boolean

  @ManyToOne(() => Criteria, (criteria: Criteria) => criteria.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  criteria: Criteria

  @ManyToOne(() => User, (user: User) => user.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  user: User

  @ManyToOne(() => User, (user: User) => user.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  evaluator: User

  @ManyToOne(() => User, (user: User) => user.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  evaluatee: User

  @ManyToOne(() => Rating, (rating: Rating) => rating.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  rating: Rating

  @ManyToOne(() => SubCriteria, (subCriteria: SubCriteria) => subCriteria.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  subCriteria: SubCriteria

  @ManyToOne(() => Event, (event: Event) => event.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  event: Event
}

export class UserSubCriteriaDto implements IUserSubCriteriaGetDto {
  criteria: CriteriaDto

  event: EventDto

  rating: RatingDto

  subCriteria: SubCriteriaDto

  user: UserDto
}