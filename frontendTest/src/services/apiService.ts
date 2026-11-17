import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import {
  LoginRequest,
  AuthResponse,
  PostDto,
  CategoryDto,
  TagDto,
  CreatePostRequestDto,
  UpdatdePostResquestDto,
  CreateCategoryRequest,
  CreateTagsRequest,
  ApiErrorResponse
} from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request Interceptor: Attach JWT token if stored in localStorage
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('blog_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response Interceptor: Global error handling & 401 handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear invalid token on 401 Unauthorized
          localStorage.removeItem('blog_auth_token');
        }
        const apiError = this.extractError(error);
        return Promise.reject(apiError);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private extractError(error: AxiosError): ApiErrorResponse {
    if (error.response?.data) {
      return error.response.data as ApiErrorResponse;
    }
    return {
      status: error.response?.status || 500,
      message: error.message || 'An unexpected error occurred. Is the Spring Boot backend running on http://localhost:8080?'
    };
  }

  // --- Auth Endpoints ---
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('blog_auth_token', response.data.token);
    }
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('blog_auth_token');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('blog_auth_token');
  }

  public getToken(): string | null {
    return localStorage.getItem('blog_auth_token');
  }

  // --- Posts Endpoints ---
  // Note: Backend parameter for category filtering is named 'categgorryId'
  public async getPosts(params?: { categoryId?: string; tagId?: string }): Promise<PostDto[]> {
    const queryParams: Record<string, string> = {};
    if (params?.categoryId) {
      queryParams['categgorryId'] = params.categoryId;
    }
    if (params?.tagId) {
      queryParams['tagId'] = params.tagId;
    }
    const response: AxiosResponse<PostDto[]> = await this.api.get('/posts', { params: queryParams });
    return response.data;
  }

  public async getPostById(id: string): Promise<PostDto> {
    const response: AxiosResponse<PostDto> = await this.api.get(`/posts/${id}`);
    return response.data;
  }

  public async getDrafts(): Promise<PostDto[]> {
    const response: AxiosResponse<PostDto[]> = await this.api.get('/posts/drafts');
    return response.data;
  }

  public async createPost(post: CreatePostRequestDto): Promise<PostDto> {
    const response: AxiosResponse<PostDto> = await this.api.post('/posts', post);
    return response.data;
  }

  public async updatePost(id: string, post: UpdatdePostResquestDto): Promise<PostDto> {
    const response: AxiosResponse<PostDto> = await this.api.put(`/posts/${id}`, post);
    return response.data;
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  // --- Categories Endpoints ---
  public async getCategories(): Promise<CategoryDto[]> {
    const response: AxiosResponse<CategoryDto[]> = await this.api.get('/categories');
    return response.data;
  }

  public async createCategory(request: CreateCategoryRequest): Promise<CategoryDto> {
    const response: AxiosResponse<CategoryDto> = await this.api.post('/categories', request);
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // --- Tags Endpoints ---
  public async getTags(): Promise<TagDto[]> {
    const response: AxiosResponse<TagDto[]> = await this.api.get('/tags');
    return response.data;
  }

  public async createTags(request: CreateTagsRequest): Promise<TagDto[]> {
    const response: AxiosResponse<TagDto[]> = await this.api.post('/tags', request);
    return response.data;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }
}

export const apiService = ApiService.getInstance();
