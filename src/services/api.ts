const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "include",
  })

  if (!response.ok) {
    if (response.status === 401)
      window.dispatchEvent(new Event("sentinel:session-expired"))
    throw new ApiError(
      (await response.text()) || "The request could not be completed.",
      response.status,
    )
  }
  return response.json() as Promise<T>
}
