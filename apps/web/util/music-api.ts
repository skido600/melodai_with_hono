const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import type { Song, ApiKey } from "@/types/music";
export async function getMusicSignature() {
  const response = await fetch(`${API_URL}/music/v1/upload-signature`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  console.log("SIGNATURE RESPONSE:", data);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not get upload signature");
  }

  return data.data;
}

export async function uploadToCloudinary(
  file: File,
  signatureData: {
    signature: string;
    timestamp: number;
    folder: string;
    apiKey: string;
    cloudName: string;
  },
) {
  const { signature, timestamp, folder, apiKey, cloudName } = signatureData;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  console.log("Uploading to Cloudinary...");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  console.log("CLOUDINARY RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data;
}

export async function completeMusicUpload(data: {
  secureUrl: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}) {
  const response = await fetch(`${API_URL}/music/v1/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  console.log("COMPLETE RESPONSE:", result);

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not process music");
  }

  return result.data;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data.data;
}

export async function getAllMusic(query = "") {
  const url = query
    ? `/music/v1/all?q=${encodeURIComponent(query)}`
    : "/music/v1/all";

  return request<Song[]>(url);
}

export async function getRecentMusic(): Promise<Song[]> {
  return request("/music/v1/recent");
}

export async function getTopMusic(): Promise<Song[]> {
  return request("/music/v1/top");
}

export async function getMyMusic(query = ""): Promise<Song[]> {
  const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";

  return request<Song[]>(`/music/v1/my${params}`);
}

export async function playMusic(songId: string) {
  return request(`/music/v1/${songId}/play`, {
    method: "POST",
  });
}

export async function generateApiKey(name: string) {
  const response = await fetch(`${API_URL}/api/v1/api-key`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not generate API key");
  }

  return data.data;
}

export async function getMyApiKeys(): Promise<ApiKey[]> {
  return request<ApiKey[]>("/api/v1/key");
}
export async function deleteApiKey(keyId: string) {
  const response = await fetch(`${API_URL}/api/v1/key/${keyId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not delete API key");
  }

  return data.data;
}

export async function deleteMusic(songId: string) {
  const response = await fetch(`${API_URL}/music/v1/${songId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not delete music");
  }

  return data.data;
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not get user");
  }

  return data.data;
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not logout");
  }

  return data;
}
