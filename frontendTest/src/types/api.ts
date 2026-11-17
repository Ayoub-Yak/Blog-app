// TypeScript interfaces strictly matching Spring Boot Backend DTOs & Models

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface AuthorDto {
  id: string;
  name: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  postCount: number;
}

export interface TagDto {
  id: string;
  name: string;
  postCount?: number;
}

export interface PostDto {
  id: string;
  title: string;
  content: string;
  author: AuthorDto;
  category: CategoryDto;
  tags: TagDto[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  status: PostStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface CreatePostRequestDto {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
}

export interface UpdatdePostResquestDto {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateTagsRequest {
  names: string[];
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
