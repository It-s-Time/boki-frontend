import { apiClient } from './client';
import { type ApiResponse } from '@/shared/types/api';

export interface MemberProfile {
  memberId: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

export const getMyProfile = async () => {
  const response =
    await apiClient.get<ApiResponse<MemberProfile>>('/api/members/me');

  return response.data;
};
