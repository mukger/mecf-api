import { Correspondence } from "src/correspondence/correspondence.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Competence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true, length: 255})
    competence_name: string;

    @Column({ type: 'json' })
    competence_key_words: { [key: string]: number };

    @Column({ type: 'text' })
    competence_description: string

    @OneToMany(() => Correspondence, correspondence => correspondence.competence)
    competenceToCourse: Correspondence[]
}