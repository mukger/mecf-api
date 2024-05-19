import { Module } from '@nestjs/common';
import { CompetenceService } from './competence.service';
import { CompetenceController } from './competence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Competence } from './competence.entity';
import { CompetencesRepository } from './competence.repository';
import { SemanticAnalysisModule } from 'src/semantic-analysis/semantic-analysis.module';
import { CorrespondenceModule } from 'src/correspondence/correspondence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competence]),
    AuthModule,
    SemanticAnalysisModule,
    CorrespondenceModule
  ],
  providers: [CompetenceService, CompetencesRepository],
  controllers: [CompetenceController],
  exports: [CompetenceService]
})
export class CompetenceModule {}
