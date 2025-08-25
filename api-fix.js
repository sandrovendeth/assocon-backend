// Cliente HTTP para comunicação com o backend NestJS

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profession?: string;
  company?: string;
  membershipType: string;
  status: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Cliente HTTP
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    // Recuperar token do localStorage no lado cliente
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth-token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const error = await response
        .json()
        .catch(() => ({ error: "Erro na requisição" }));

      console.log("Error response:", error);
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Métodos de autenticação
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
    }
  }

  // Auth endpoints - CORRIGIDO: usa access_token em vez de token
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; access_token: string }> {
    const response = await this.request<{ user: User; access_token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
    this.clearToken();
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async register(data: any): Promise<{ user: User; access_token: string }> {
    const response = await this.request<{ user: User; access_token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  // Posts endpoints
  async getPosts(params?: {
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ posts: Post[]; pagination: any }>(
      `/posts${query ? `?${query}` : ""}`
    );
  }

  async createPost(data: any): Promise<{ post: Post }> {
    return this.request<{ post: Post }>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: any): Promise<{ post: Post }> {
    return this.request<{ post: Post }>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.request(`/posts/${id}`, { method: "DELETE" });
  }

  // Members endpoints
  async getMembers(): Promise<Member[]> {
    return this.request<Member[]>("/members");
  }

  async createMember(data: any): Promise<{ member: Member }> {
    return this.request<{ member: Member }>("/members", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMember(id: string, data: any): Promise<{ member: Member }> {
    return this.request<{ member: Member }>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string): Promise<void> {
    await this.request(`/members/${id}`, { method: "DELETE" });
  }

  // Contact endpoints
  async sendContactMessage(data: any): Promise<{ message: ContactMessage }> {
    return this.request<{ message: ContactMessage }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.request<ContactMessage[]>("/contact");
  }

  async markContactAsRead(id: string): Promise<void> {
    await this.request(`/contact/${id}/read`, { method: "PUT" });
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient();

// Hook para facilitar o uso em componentes React
export function useApi() {
  return apiClient;
}
