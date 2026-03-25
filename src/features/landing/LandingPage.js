import '@/features/chat/styles/chat.css';

export const metadata = {
  title: '採用サイト向けチャットボット',
  description: '企業の採用サイト向け匿名Q&Aチャットボット',
};

/**
 * ランディングページ
 * 情報の優先順位: 1. 何ができるか → 2. デモ → 3. 導入方法
 * 装飾は最小限。内容で伝える。
 */
export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Noto Sans JP', sans-serif",
      color: '#0f172a',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}>
        {/* ① 何ができるか：最初に目に入る */}
        <header style={{ marginBottom: '48px' }}>
          <p style={{
            fontSize: '13px',
            color: '#0d9488',
            fontWeight: '600',
            marginBottom: '12px',
            letterSpacing: '0.5px',
          }}>
            採用Q&Aチャットボット
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            lineHeight: 1.5,
            marginBottom: '16px',
            color: '#0f172a',
          }}>
            学生が聞きづらい質問を、<br />匿名で安心して聞ける場所。
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.8,
          }}>
            企業の採用サイトに設置するチャットボット。残業や離職率など、人事に直接は聞きにくい質問に匿名で回答します。企業側は学生が何を知りたいかのデータを自動で収集できます。
          </p>
        </header>

        {/* ② デモ：実物を見せる */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '560px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}>
            <iframe
              src="/chat/ryukyu"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="チャットボットデモ"
            />
          </div>
        </section>

        {/* ③ 仕組み：3点だけ。4点以上は情報過多 */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#0f172a',
          }}>
            仕組み
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {[
              { num: '1', title: '匿名で質問', desc: 'ログイン不要。個人情報は収集しません。' },
              { num: '2', title: 'AIが企業情報を元に回答', desc: 'スプレッドシートに登録されたQ&Aデータに基づいて回答します。' },
              { num: '3', title: '質問データを自動収集', desc: '学生が何を知りたいかのデータが企業にフィードバックされます。' },
            ].map((item) => (
              <div key={item.num} style={{
                display: 'flex',
                gap: '14px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#0d9488',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  flexShrink: 0,
                }}>
                  {item.num}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ④ 導入方法：最後にアクション */}
        <section>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#0f172a',
          }}>
            導入方法
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#475569',
            marginBottom: '12px',
          }}>
            HTMLに以下の1行を追加するだけで設置できます。
          </p>
          <pre style={{
            background: '#0f172a',
            color: '#94a3b8',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: 1.6,
            overflowX: 'auto',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}>
            <code>
              {'<script src="https://your-app.vercel.app/widget.js"\n  data-tenant="your-tenant-id"></script>'}
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
}
