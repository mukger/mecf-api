import { Competence } from "src/competence/competence.entity";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Course } from "../course/course.entity";
import { Exclude } from "class-transformer";

@Entity()
@Unique(["competence", "course"])
export class Correspondence {
    @PrimaryGeneratedColumn('uuid')
    @Exclude({toPlainOnly: true})
    id: string;

    @Column({type: 'decimal', precision: 4, scale: 3})
    similarity: number;

    @ManyToOne(() => Competence, (competence) => competence.competenceToCourse, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'competence_id' })
    competence: Competence

    @ManyToOne(() => Course, (course) => course.competenceToCourse, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: Course
}