import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/user/common/decorators';
import { AtGuard } from '../user/common/guards';
import { BlogService } from './blog.service';
import { IBlogCreationDto, IUpdatePostDto, ResponseStatus } from './types';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  getAllPosts(): Promise<ResponseStatus> {
    return this.blogService.getPosts();
  }

  @Get('single')
  getSinglePost(@Query('postId') postId: string): Promise<ResponseStatus> {
    return this.blogService.singlePost(postId);
  }

  //   @UseGuards(AtGuard)
  @Post('create')
  createPosts(
    @Body() iBlogCreationDto: IBlogCreationDto,
  ): Promise<ResponseStatus> {
    return this.blogService.createBlogPost(iBlogCreationDto);
  }

  @Delete('delete')
  deletePost(
    @GetCurrentUser('email') userEmail: string,
    @Query('postId') postId: string,
  ): Promise<ResponseStatus> {
    return this.blogService.deletePost(postId);
  }

  // @Patch('edit')
  // editPost(
  //   @GetCurrentUser('email') userEmail: string,
  //   @Body() iUpdatePostDto: IUpdatePostDto,
  // ): Promise<ResponseStatus> {
  //   return this.blogService.updatePost(iUpdatePostDto, userEmail);
  // }
}
