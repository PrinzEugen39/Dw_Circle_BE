import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Threads } from "./Thread";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @OneToMany(() => Threads, (thread) => thread.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads[];
}
