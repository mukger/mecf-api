import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UsersRoles } from "src/data/users-roles";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Exclude({toPlainOnly: true})
    id: string;

    @Column({unique: true, length: 20})
    login: string;

    @Column({unique: true, length: 50})
    email: string;

    @Column({length: 60})
    @Exclude({toPlainOnly: true})
    password: string;

    @Column({
        type: "enum",
        enum: UsersRoles,
        default: UsersRoles.USER
    })
    role: UsersRoles
}