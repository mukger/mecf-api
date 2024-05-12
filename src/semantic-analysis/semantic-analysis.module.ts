import { Module } from '@nestjs/common';
import { SemanticAnalysisService } from './semantic-analysis.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ],
  providers: [SemanticAnalysisService],
  exports: [SemanticAnalysisService]
})
export class SemanticAnalysisModule {}
