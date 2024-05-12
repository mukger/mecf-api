import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesRepository } from './courses.repository';
import { SemanticAnalysisModule } from 'src/semantic-analysis/semantic-analysis.module';
import { CorrespondenceModule } from 'src/correspondence/correspondence.module';
import { CompetenceModule } from 'src/competence/competence.module';

@Module({ 
  imports: [
    TypeOrmModule.forFeature([Course]),
    AuthModule,
    SemanticAnalysisModule,
    CorrespondenceModule,
    CompetenceModule
  ],
  providers: [CourseService, CoursesRepository],
  controllers: [CourseController]
})
export class CourseModule {}
