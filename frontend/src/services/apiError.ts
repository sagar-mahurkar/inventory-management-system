import axios from 'axios';

type ApiErrorPayload = { error?: { code?: string; message?: string; details?: unknown }; message?: string };
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data;
    if (payload?.error?.message) return payload.error.message;
    if (payload?.message) return payload.message;
    if (error.response?.status === 409) return 'This change conflicts with existing inventory data.';
    if (!error.response) return 'Unable to reach the server. Check that the backend is running and the API URL is correct.';
  }
  return fallback;
}
