import axios from 'axios';

interface ApiErrorEnvelope {
  message?: string;
  code?: string;
  error?: string;
}

// Shared axios error → Korean message mapping used by any screen that shows
// its own failure text instead of relying on the client.ts interceptor's
// console logging alone (sync, API key registration, etc.).
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorEnvelope | undefined;
    const serverMessage = responseData?.message || responseData?.error;

    if (serverMessage) {
      return responseData?.code
        ? `${serverMessage} (${responseData.code})`
        : serverMessage;
    }

    if (error.response?.status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해주세요.';
    }

    if (error.response?.status) {
      return `${fallbackMessage} (${error.response.status})`;
    }

    if (error.code === 'ECONNABORTED') {
      return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }

    return `서버에 연결할 수 없습니다. (${error.message})`;
  }

  return error instanceof Error
    ? `${fallbackMessage} (${error.message})`
    : fallbackMessage;
}
