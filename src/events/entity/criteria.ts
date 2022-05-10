import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany} from 'typeorm'
import {ICriteria} from '../interface/criteriaInterface'
import {UserSubCriteria} from './userSubCriteria'
import {Event} from './event'
import {SubCriteria, SubCriteriaDto} from './subCriteria'

@Entity()
export class Criteria implements ICriteria {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  criteria: boolean

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]

  @ManyToMany(() => Event, (event) => event.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  events: Event[]

  @OneToMany(() => SubCriteria, (subCriteria) => subCriteria.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  subCriteria: SubCriteria[]
}

export class CriteriaDto {
  id: number

  name: string

  criteria: boolean

  subCriteria: SubCriteriaDto[]
}
