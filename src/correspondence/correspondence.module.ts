import { Module } from '@nestjs/common';
import { CorrespondenceService } from './correspondence.service';
import { CorrespondenceRepository } from './correspondence.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Correspondence } from './correspondence.entity';
import { SemanticAnalysisModule } from 'src/semantic-analysis/semantic-analysis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Correspondence]),
    SemanticAnalysisModule
  ],
  providers: [CorrespondenceService, CorrespondenceRepository],
  exports: [CorrespondenceService]
})
export class CorrespondenceModule {}
