/** @format */

import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class Updoot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  value: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
