import { Entity, Index, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Entity({name: 'users'})
export class User {

    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    name!: string;

    @Index({unique: true})
    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ default: UserRole.USER})
    role!: 'ADMIN' | 'USER';

    @CreateDateColumn()
    createdAt!: Date;
}