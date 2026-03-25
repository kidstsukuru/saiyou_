import { handleOptions, handlePost } from '@/features/chat/api/handler';

/**
 * ルーティング専用 - ビジネスロジックは features/chat/api に委譲
 */
export async function OPTIONS(request) {
  return handleOptions(request);
}

export async function POST(request) {
  return handlePost(request);
}
