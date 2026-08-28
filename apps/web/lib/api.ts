"use server";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function login() {
  try {
    const res = await fetch(`${API_URL}/auth/google/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to get Google login URL");
    }

    const data = await res.json();
    console.log("frontend return", data);
    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to sign in with Google",
    };
  }
}
