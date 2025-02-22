import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({type: "decimal", precision: 10, scale:2, nullable:false})
    amount: number;

    @Column()
    description: string;

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    createdAt: Date;
}