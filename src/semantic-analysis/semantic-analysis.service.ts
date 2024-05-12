import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class SemanticAnalysisService {
    constructor(  
        private readonly httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async determineKeyWords(text: string): Promise<AxiosResponse<{ [key: string]: number }>> {
        return this.httpService.axiosRef.post<{ [key: string]: number }>(`${this.configService.get('SUBSID_API')}/keywords`, {text})
    }

    async determineVectorsSimilarity(firstWordDict: { [key: string]: number }, secondWordDict: { [key: string]: number }): Promise<AxiosResponse<{ similarity: number }>> {
        return this.httpService.axiosRef.post<{ similarity: number }>(`${this.configService.get('SUBSID_API')}/similarity`, {
            first_word_dict: firstWordDict,
            second_word_dict: secondWordDict
        })
    }

    async determineSimilarityMatrix(firstWordDict: { [key: string]: number }, secondWordDict: { [key: string]: number }): Promise<AxiosResponse> {
        return this.httpService.axiosRef.post(`${this.configService.get('SUBSID_API')}/simmatrix`, {
            first_word_dict: firstWordDict,
            second_word_dict: secondWordDict
        })
    }
}
