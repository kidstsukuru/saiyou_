import SetupPage from '@/features/setup/SetupPage';

export const metadata = {
  title: 'ご利用ガイド - 採用Q&Aチャットボット',
  description: '企業情報の入力方法ガイド',
};

/**
 * ルーティング専用 - UIは features/setup に委譲
 */
export default function Setup() {
  return <SetupPage />;
}
