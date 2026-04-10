import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn } from "typeorm";

@Entity('reviews')
@Index(['propertyId'])
@Index(['userId'])
@Index(['userId','propertyId'], {unique:true})  // prevent duplicate reviews at DB level

export class Review{
   @ObjectIdColumn()
   id!: ObjectId;

   @Column()
   userId!: string;
   
   @Column()
   propertyId!: string;

   @Column()
   rating!: number;

   @Column()
   comment!: string;

   @CreateDateColumn()
   createdAt !: Date;
   
}