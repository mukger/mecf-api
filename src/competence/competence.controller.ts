import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CompetenceService } from './competence.service';
import { Competence } from './competence.entity';
import { AddCompetenceDto } from './dto/add-competence.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/meta-data-roles.decorator';
import { ChangeCompetenceDto } from './dto/change-competence.dto';

@UseGuards(JwtAuthGuard)
@Controller('competence')
export class CompetenceController {
    constructor(private readonly competenceService: CompetenceService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAllCompetences(): Promise<Competence[]> {
        return this.competenceService.getAllCompetences()
    }

    @Get('/:competenceId')
    @HttpCode(HttpStatus.OK)
    getCompetenceById(
        @Param('competenceId', new ParseUUIDPipe()) competenceId: string
    ): Promise<Competence> {
        return this.competenceService.getCompetenceById(competenceId)
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles('admin')
    addCompetence(
        @Body() addCompetenceDto: AddCompetenceDto
    ): Promise<Competence> {
        return this.competenceService.addCompetence(addCompetenceDto)
    }

    @Patch('/:competenceId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles('admin')
    changeCompetenceById(
        @Param('competenceId', new ParseUUIDPipe()) competenceId: string,
        @Body() changeCompetenceDto: ChangeCompetenceDto
    ): Promise<Competence> {
        return this.competenceService.changeCompetenceById(competenceId, changeCompetenceDto)
    }

    @Delete('/:competenceId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles('admin')
    deleteCompetenceById(
        @Param('competenceId', new ParseUUIDPipe()) competenceId: string
    ): Promise<void> {
        return this.competenceService.deleteCompetenceById(competenceId)
    }
}
