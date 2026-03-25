/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // セキュリティヘッダー
  async headers() {
    return [
      {
        // 全ページ共通のセキュリティヘッダー
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // チャットページ（iframe許可 - 全オリジンから許可、本番ではテナントのドメインに制限）
        source: '/chat/:tenantId*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
      {
        // APIルート
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
