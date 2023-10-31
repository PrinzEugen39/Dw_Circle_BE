import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Threads } from "./Thread";
import { Replies } from "./Replies";
import { Likes } from "./Likes";

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

  @Column({ select: true })
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @OneToMany(() => Threads, (thread) => thread.user_id, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads[];

  @OneToMany(() => Replies, (replies) => replies.user_id, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  replies: Replies[];

  @OneToMany(() => Likes, (likes) => likes.user_id, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  likes: Likes[];

  @ManyToMany(() => User, user => user.users, {
    nullable: true
  })
  @JoinTable({
    name: "following",
    joinColumn: {
      name: "following_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "follower_id",
      referencedColumnName: "id"
    }
  })
  users: User[];

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updated_at: Date;
}
