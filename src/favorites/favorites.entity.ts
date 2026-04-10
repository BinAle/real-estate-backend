import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn  } from "typeorm";

@Entity()
export class Favorite{

    @ObjectIdColumn()
    id!:ObjectId;

    @Column()
    userId!: string;

    @Column()
    propertyId!: string;

    @CreateDateColumn()
    createdAt!: Date;

}

