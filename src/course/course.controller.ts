import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/meta-data-roles.decorator';
import { AddCourseDto } from './dto/add-course.dto';
import { ChangeCourseDto } from './dto/change-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Correspondence } from 'src/correspondence/correspondence.entity';
import { GetCoursesByIdsDto } from './dto/get-courses-by-ids.dto';

@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllCourse(): Promise<Course[]> {
        return this.courseService.getAllCourses()
    }

    @Get('/:courseId')
    @HttpCode(HttpStatus.OK)
    getCourseById(
        @Param('courseId', new ParseUUIDPipe()) courseId: string
    ): Promise<Course> {
        return this.courseService.getCourseById(courseId)
    }

    @Get('/:courseId/correspondence')
    @HttpCode(HttpStatus.OK)
    getCorrespondencesById(
        @Param('courseId', new ParseUUIDPipe()) courseId: string
    ): Promise<Correspondence[]> {
        return this.courseService.getCorrespondencesById(courseId)
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles('admin')
    addCourse(
        @Body() addCourseDto: AddCourseDto
    ): Promise<Course> {
        return this.courseService.addCourse(addCourseDto)
    }

    @Post('/batch')
    @HttpCode(HttpStatus.OK)
    getCoursesByIds(
        @Body() getCoursesByIdsDto: GetCoursesByIdsDto
    ): Promise<Course[]> {
        return this.courseService.getCoursesByIds(getCoursesByIdsDto)
    }

    @Patch('/:courseId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles('admin')
    changeCourseById(
        @Param('courseId', new ParseUUIDPipe()) courseId: string,
        @Body() changeCourseDto: ChangeCourseDto
    ): Promise<Course> {
        return this.courseService.changeCourseById(courseId, changeCourseDto)
    }

    @Delete('/:courseId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles('admin')
    deleteCourseById(
        @Param('courseId', new ParseUUIDPipe()) courseId: string
    ): Promise<void> {
        return this.courseService.deleteCourseById(courseId)
    }
}
