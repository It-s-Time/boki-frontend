import { apiClient } from './client';

interface ExchangeResult {
  memberId: number;
  email: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
}

export const exchangeLoginCode = async (loginCode: string): Promise<ExchangeResult> => {
  const { data } = await apiClient.post('/auth/oauth2/exchange', { loginCode });
  return data.result;
};

export const logoutApi = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};
