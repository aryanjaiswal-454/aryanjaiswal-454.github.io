import axios from "axios";
import type {
  ApiMessage,
  FeaturedPost,
  GithubRepo,
  Project,
  SkillGroup,
  TimelineItem
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 12_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await api.get<T>(path);
    return response.data;
  } catch (error) {
    const detail = axios.isAxiosError<ApiMessage>(error)
      ? error.response?.data?.error || error.message
      : "Unexpected API error";
    console.warn(`Using local portfolio data for ${path}: ${detail}`);
    return fallback;
  }
}

export const getProjects = (fallback: Project[]) =>
  fetchWithFallback<Project[]>("/projects", fallback);

export const getSkills = (fallback: SkillGroup[]) =>
  fetchWithFallback<SkillGroup[]>("/skills", fallback);

export const getTimeline = (fallback: TimelineItem[]) =>
  fetchWithFallback<TimelineItem[]>("/experience", fallback);

export const getPosts = (fallback: FeaturedPost[]) =>
  fetchWithFallback<FeaturedPost[]>("/posts", fallback);

export const getGithubRepos = (fallback: GithubRepo[]) =>
  fetchWithFallback<GithubRepo[]>("/github/repos", fallback);

export async function adminLogin(email: string, password: string): Promise<void> {
  await api.post("/auth/login", { email, password });
}

export async function adminLogout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getCurrentAdmin(): Promise<{ email: string } | null> {
  try {
    const response = await api.get<{ email: string }>("/auth/me");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status || 0)) {
      return null;
    }
    throw error;
  }
}

export async function getAdminRecords<T>(resource: string): Promise<T[]> {
  const response = await api.get<T[]>(`/admin/${resource}`);
  return response.data;
}

export async function adminCreate<T>(resource: string, payload: T): Promise<T> {
  const response = await api.post<T>(`/admin/${resource}`, payload);
  return response.data;
}

export async function adminUpdate<T>(resource: string, id: string, payload: T): Promise<T> {
  const response = await api.put<T>(`/admin/${resource}/${id}`, payload);
  return response.data;
}

export async function adminDelete(resource: string, id: string): Promise<void> {
  await api.delete(`/admin/${resource}/${id}`);
}

export function getApiError(error: unknown): string {
  if (axios.isAxiosError<ApiMessage>(error)) {
    return error.response?.data?.error || "The request could not be completed.";
  }
  return error instanceof Error ? error.message : "The request could not be completed.";
}
