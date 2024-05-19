import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { CorrespondenceMatrixDto } from 'src/competence/dto/correspondence-matrix.dto';
import { DetermineSimilarityDto } from './dto/determine-similarity.dto';
import { DetermineKeyWordsDto } from './dto/determine-key-words.dto';

@Injectable()
export class SemanticAnalysisService {
    constructor(  
        private readonly httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async determineKeyWords(
        determineKeyWordsDto: DetermineKeyWordsDto
    ): Promise<AxiosResponse<{ [key: string]: number }>> {
        return this.httpService.axiosRef.post(`${this.configService.get('SUBSID_API')}/keywords`, determineKeyWordsDto)
    }

    async determineSimilarity(
        determineSimilarityDto: DetermineSimilarityDto
    ): Promise<AxiosResponse<{ similarity: number }>> {
        const { firstWordDict, secondWordDict } = determineSimilarityDto
        return this.httpService.axiosRef.post(`${this.configService.get('SUBSID_API')}/similarity`, {
            first_word_dict: firstWordDict,
            second_word_dict: secondWordDict
        })
    }

    async determineSimilarityMatrix(
        determineSimilarityDto: DetermineSimilarityDto
    ): Promise<AxiosResponse<CorrespondenceMatrixDto>> {
        const { firstWordDict, secondWordDict } = determineSimilarityDto
        return this.httpService.axiosRef.post(`${this.configService.get('SUBSID_API')}/simmatrix`, {
            first_word_dict: firstWordDict,
            second_word_dict: secondWordDict
        })
    }
}
