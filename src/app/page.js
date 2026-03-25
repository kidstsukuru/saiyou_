import LandingPage from '@/features/landing/LandingPage';

export const metadata = {
  title: '採用サイト向けチャットボット',
  description: '企業の採用サイト向け匿名Q&Aチャットボット',
};

/**
 * ルーティング専用 - UIは features/landing に委譲
 */
export default function Home() {
  return <LandingPage />;
}
