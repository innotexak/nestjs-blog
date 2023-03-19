import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { IBlogCreationDto, IUpdatePostDto, ResponseStatus } from './types';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogRepository: Model<BlogDocument>,
  ) {}

  logger = new Logger('blogService');

  async createBlogPost(
    iBlogCreationDto: IBlogCreationDto,
  ): Promise<ResponseStatus> {
    const created = await this.blogRepository.create(iBlogCreationDto);
    const saved = created.save();
    if (saved) {
      const res: ResponseStatus = {
        statusCode: HttpStatus.CREATED,
        message: 'Post created',
      };
      return res;
    }
  }

  async getPosts(): Promise<ResponseStatus> {
    const posts = await this.blogRepository.find({}).populate('user');
    if (!posts || posts.length <= 0)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const res: ResponseStatus = {
      statusCode: HttpStatus.OK,
      message: 'Post(s) retrieved successfully',
      data: posts,
    };
    return res;
  }

  async singlePost(postId: string): Promise<ResponseStatus> {
    const post = await this.blogRepository
      .findById({ _id: postId })
      .populate('user');

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const { _id, title, content } = post;
    const { firstName, lastName } = post.user;
    const creator = `${firstName} ${lastName}`;

    const res: ResponseStatus = {
      statusCode: HttpStatus.CREATED,
      message: 'Post(s) retrieved successfully',
      data: { _id, title, content, creator },
    };
    return res;
  }

  async deletePost(postId: string): Promise<ResponseStatus> {
    const deleted = await this.blogRepository.deleteOne({ _id: postId });
    if (!deleted)
      throw new HttpException(
        'Unable to delete this post',
        HttpStatus.BAD_REQUEST,
      );
    if (deleted.acknowledged) {
      const res: ResponseStatus = {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
      return res;
    }
  }

  // async updatePost(
  //   iUpdatePostDto: IUpdatePostDto,
  //   userEmail: string,
  // ): Promise<ResponseStatus> {
  //   const isUser = await this.blogRepository.findOne({ email: userEmail });
  //   const toEdit = await this.blogRepository
  //     .findById({ _id: iUpdatePostDto.id })
  //     .populate('user');

  //   const update = await this.blogRepository.updateOne(
  //     { _id: iUpdatePostDto.id },
  //     { $set: iUpdatePostDto.payload },
  //     { new: true },
  //   );
  //   if (!update)
  //     throw new HttpException(
  //       'Unable to update your post',
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   const res: ResponseStatus = {
  //     statusCode: HttpStatus.OK,
  //     message: 'Post updated',
  //   };
  //   return res;
  // }
}
