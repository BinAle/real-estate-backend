import { Entity, ObjectIdColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

export enum PropertyStatus{
    AVAILABLE = 'available',
    SOLD = 'sold',
    RENTED = 'rented',
}

export enum PropertyType{
    HOUSE = 'house',
    APARTMENT = 'apartment',
    PLOT = 'plot',
}

@Entity({ name: 'property' })
export class Property{

    @ObjectIdColumn()
    id!: ObjectId;

    @Index()
    @Column()
    title!: string;

    @Column()
    description!: string;

    @Index()
    @Column()
    price!: number;

    @Column({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.AVAILABLE })
    status!: PropertyStatus;

    @Column({ type: 'enum', enum: PropertyType })
    type!: PropertyType;

    @Index()
    @Column()
    location!: string;

    @Column()
    area!: string;

    @Column()
    ownerId!: string; 

    @Column({ type: 'array', nullable: true })
    images! : string[];

    @Column({ default: true })
    isActive!: boolean;

    @Column({default: false})
    isDeleted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ default: 0 })
    averageRating!: number;

    @Column({ default: 0 })
    totalReviews!: number;
}