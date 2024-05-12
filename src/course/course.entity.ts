import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Correspondence } from "src/correspondence/correspondence.entity";

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    @Exclude({toPlainOnly: true})
    id: string;

    @Column({unique: true, length: 255})
    course_name: string;

    @Column({ type: 'json' })
    course_key_words: { [key: string]: number };

    @Column({ type: 'text' })
    course_materials: string

    @OneToMany(() => Correspondence, correspondence => correspondence.course)
    competenceToCourse: Correspondence[]
}