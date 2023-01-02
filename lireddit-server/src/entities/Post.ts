/** @format */

import { Field, Int, ObjectType } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Column,
  BaseEntity, ManyToOne,
} from 'typeorm';
import {User} from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({type: 'int', default: 0})
  points!: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.posts)
  creator: User
}