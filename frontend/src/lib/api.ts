const API_BASE = "http://localhost:8000";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// Auth
export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function register(username: string, email: string, password: string) {
  return request<{ id: number; username: string; email: string }>("/users/register", {
    method: "POST",
    body: { username, email, password },
  });
}

export async function logout(token: string) {
  return request<void>("/users/logout", { method: "POST", token });
}

export async function updateUser(token: string, data: { username?: string; email?: string; password?: string }) {
  return request<{ id: number; username: string; email: string }>("/users/update", {
    method: "PUT",
    body: data,
    token,
  });
}

// Learning Paths
export interface LearningPath {
  id: number;
  topic: string;
  proficency?: string;
  learning_type?: string[];
  weeks: number;
  created_at: string;
  user_id: number;
}

export async function getLearningPaths(token: string) {
  return request<LearningPath[]>("/learning-paths/", { token });
}

export async function createLearningPath(
  token: string,
  data: { topic: string; proficency?: string; learning_type?: string[]; weeks: number }
) {
  return request<LearningPath>("/learning-paths/", {
    method: "POST",
    body: data,
    token,
  });
}

export async function deleteLearningPath(token: string, id: number) {
  return request<void>(`/learning-paths/${id}`, { method: "DELETE", token });
}
