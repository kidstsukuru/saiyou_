import '@/features/setup/styles/setup.css';

/**
 * 企業向けご利用ガイド
 *
 * 企業が見るのはこのページだけ。
 * GAS・プロンプト・システム構成には一切触れない。
 */
export default function SetupPage() {
  return (
    <div className="setup-page">

      {/* ヘッダー */}
      <header className="setup-header">
        <div className="setup-breadcrumb">
          <a href="/">トップ</a> / ご利用ガイド
        </div>
        <h1 className="setup-title">ご利用ガイド</h1>
        <p className="setup-subtitle">
          チャットボットが学生に回答するための企業情報の入力方法をご案内します。
        </p>
      </header>

      {/* 目次 */}
      <nav className="setup-toc">
        <div className="setup-toc-title">目次</div>
        <ol className="setup-toc-list">
          <li>
            <a href="#step1">
              <span className="toc-number">1</span>
              スプレッドシートを開く
            </a>
          </li>
          <li>
            <a href="#step2">
              <span className="toc-number">2</span>
              企業情報を入力する
            </a>
          </li>
          <li>
            <a href="#step3">
              <span className="toc-number">3</span>
              チャットで確認する
            </a>
          </li>
        </ol>
      </nav>

      {/* ==============================
          STEP 1: スプレッドシートを開く
          ============================== */}
      <section id="step1" className="setup-section">
        <div className="setup-section-header">
          <span className="section-number">1</span>
          <h2 className="section-title">スプレッドシートを開く</h2>
        </div>

        <div className="setup-step">
          <div className="step-label">1-1. 共有されたスプレッドシートにアクセス</div>
          <p className="step-text">
            導入時にお送りしたGoogleスプレッドシートのURLを開いてください。
            「ナレッジ」というシートが編集可能になっています。
          </p>
          <div className="img-placeholder">
            📷 スクリーンショット：共有されたスプレッドシートの画面
          </div>

          <div className="setup-note">
            <div className="setup-note-title">ご確認ください</div>
            スプレッドシートのURLが届いていない場合は、運営チームまでお問い合わせください。
          </div>
        </div>
      </section>

      {/* ==============================
          STEP 2: 企業情報を入力する
          ============================== */}
      <section id="step2" className="setup-section">
        <div className="setup-section-header">
          <span className="section-number">2</span>
          <h2 className="section-title">企業情報を入力する</h2>
        </div>

        <div className="setup-step">
          <div className="step-label">2-1. 入力ルール</div>
          <p className="step-text">
            「ナレッジ」シートに、御社の情報を入力してください。
            1行目はヘッダー（変更不要）です。2行目からデータを入力します。
          </p>
          <table className="setup-table">
            <thead>
              <tr>
                <th>列</th>
                <th>項目名</th>
                <th>入力内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A列</td>
                <td><strong>カテゴリ</strong></td>
                <td>情報の分類名（例：残業、福利厚生、社風）</td>
              </tr>
              <tr>
                <td>B列</td>
                <td><strong>項目</strong></td>
                <td>具体的な項目名（例：月平均残業時間、住宅手当）</td>
              </tr>
              <tr>
                <td>C列</td>
                <td><strong>内容</strong></td>
                <td>事実や数値をそのまま記入</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="setup-step">
          <div className="step-label">2-2. 入力例</div>
          <p className="step-text">
            質問文を考える必要はありません。事実をそのまま書くだけで、AIが学生の質問に合わせて自然に回答します。
          </p>
          <table className="setup-table">
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>項目</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>残業</td>
                <td>月平均残業時間</td>
                <td>15〜20時間</td>
              </tr>
              <tr>
                <td>福利厚生</td>
                <td>住宅手当</td>
                <td>世帯主に月額2万円支給</td>
              </tr>
              <tr>
                <td>社風</td>
                <td>平均年齢</td>
                <td>32歳</td>
              </tr>
              <tr>
                <td>有給休暇</td>
                <td>取得率</td>
                <td>78%</td>
              </tr>
              <tr>
                <td>選考</td>
                <td>選考フロー</td>
                <td>書類選考 → 一次面接 → 二次面接 → 最終面接</td>
              </tr>
            </tbody>
          </table>
          <div className="img-placeholder">
            📷 スクリーンショット：スプレッドシートにデータが入力された状態
          </div>
        </div>

        <div className="setup-step">
          <div className="step-label">2-3. おすすめのカテゴリ</div>
          <p className="step-text">
            学生がよく気にするテーマを網羅すると、チャットボットの回答精度が上がります。
          </p>
          <table className="setup-table">
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>入力する情報の例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>残業</td>
                <td>月平均時間、ノー残業デー、休日出勤の有無</td>
              </tr>
              <tr>
                <td>有給休暇</td>
                <td>付与日数、取得率、長期休暇の制度</td>
              </tr>
              <tr>
                <td>離職率</td>
                <td>新卒3年以内の離職率、主な退職理由</td>
              </tr>
              <tr>
                <td>給与</td>
                <td>初任給、賞与回数・実績、昇給の仕組み</td>
              </tr>
              <tr>
                <td>福利厚生</td>
                <td>住宅手当、社食、交通費、資格支援</td>
              </tr>
              <tr>
                <td>リモートワーク</td>
                <td>制度の有無、フレックスタイム</td>
              </tr>
              <tr>
                <td>研修制度</td>
                <td>新人研修の内容・期間、メンター制度</td>
              </tr>
              <tr>
                <td>社風</td>
                <td>企業文化、平均年齢、イベント</td>
              </tr>
              <tr>
                <td>配属</td>
                <td>配属の決め方、転勤の有無</td>
              </tr>
              <tr>
                <td>選考</td>
                <td>選考フロー、面接の特徴、OB訪問</td>
              </tr>
            </tbody>
          </table>

          <div className="setup-note">
            <div className="setup-note-title">ポイント</div>
            情報は随時追加・修正できます。まずは10〜20件ほど入力していただければ、チャットボットが回答を開始します。
          </div>
        </div>
      </section>

      {/* ==============================
          STEP 3: チャットで確認
          ============================== */}
      <section id="step3" className="setup-section">
        <div className="setup-section-header">
          <span className="section-number">3</span>
          <h2 className="section-title">チャットで確認する</h2>
        </div>

        <div className="setup-step">
          <div className="step-label">3-1. 動作確認</div>
          <p className="step-text">
            情報を入力したら、チャット画面で実際に質問してみてください。
            入力した情報に基づいた回答が返ってくれば成功です。
          </p>
          <div className="img-placeholder">
            📷 スクリーンショット：チャットで質問 → 回答が表示された画面
          </div>

          <div className="setup-note">
            <div className="setup-note-title">反映のタイミング</div>
            スプレッドシートを更新すると、次の質問から新しい情報が反映されます。特別な操作は不要です。
          </div>
        </div>

        <div className="setup-step">
          <div className="step-label">3-2. 情報の追加・修正</div>
          <p className="step-text">
            回答内容を改善したい場合は、スプレッドシートの該当行を修正するだけです。
            行を追加すれば新しい情報にも回答できるようになります。
          </p>
        </div>
      </section>

      {/* 完了 */}
      <div className="setup-complete">
        <div className="setup-complete-title">設定完了</div>
        <div className="setup-complete-text">
          お疲れさまでした。情報の追加・更新はいつでもスプレッドシートから行えます。
          ご不明な点がございましたら、運営チームまでお気軽にお問い合わせください。
        </div>
      </div>

    </div>
  );
}
