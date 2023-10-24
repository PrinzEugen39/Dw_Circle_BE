import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "threads" })
export class Threads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;
  
  @ManyToOne(() => User, (user) => user.threads, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;
}
