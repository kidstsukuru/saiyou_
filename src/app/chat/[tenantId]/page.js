import ChatWidget from '@/features/chat/components/ChatWidget';
import '@/features/chat/styles/chat.css';

export const metadata = {
  title: '採用Q&Aチャット',
  description: '採用に関する質問に匿名でお答えします',
};

/**
 * テナント別チャットページ（iframe表示用）
 * ルーティング専用 - UIは features/chat に委譲
 */
export default async function ChatPage({ params }) {
  const { tenantId } = await params;

  return <ChatWidget tenantId={tenantId} />;
}
