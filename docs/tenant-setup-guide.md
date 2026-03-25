# 新規テナント追加手順（社内用）

## 前提
- Googleアカウント（スプレッドシート・GAS管理用）
- Vercelプロジェクトへのアクセス

## 手順

### 1. スプレッドシートを作成
1. Google Sheetsで新規スプレッドシートを作成
2. ファイル名: `[企業名] - 採用Q&Aチャットボット`

### 2. シートを構成
#### 「ナレッジ」シート
- A1: `カテゴリ` / B1: `項目` / C1: `内容`
- ※ 企業がデータを入力するシート

#### 「質問ログ」シート
- A1: `タイムスタンプ` / B1: `セッションID` / C1: `質問` / D1: `回答` / E1: `カテゴリ`
- ※ 自動記録用。企業には編集不可にする

### 3. GASを設定
1. 「拡張機能」→「Apps Script」
2. `docs/gas-script.js` の内容を貼り付けて保存
3. 「デプロイ」→「新しいデプロイ」→ ウェブアプリ → 自分 → 全員
4. デプロイURLをコピー

### 4. シート保護を設定
1. 「質問ログ」シートのタブ右クリック →「シートを保護」
2. 自分だけ編集可能に設定
3. ※ ナレッジシートは企業が編集するので保護しない

### 5. 企業に共有
1. スプレッドシートを企業のGoogleアカウントに「編集者」で共有
2. ※ 企業はナレッジシートのみ編集可（質問ログは保護済み）
3. ※ GASはオーナーにしか見えないので、コードは非公開のまま

### 6. tenants.json に追加
```json
"tenant-id": {
  "name": "企業名株式会社",
  "gasUrl": "https://script.google.com/macros/s/xxx/exec",
  "allowedOrigins": ["https://企業のドメイン.co.jp"],
  "blockedTopics": [],
  "customRules": []
}
```

### 7. デプロイ
```bash
git add config/tenants.json
git commit -m "Add tenant: 企業名"
git push  # Vercelが自動デプロイ
```

### 8. 企業に案内
- ご利用ガイドURL: `https://your-app.vercel.app/setup`
- 埋め込みコード:
```html
<script src="https://your-app.vercel.app/widget.js" data-tenant="tenant-id"></script>
```

## チェックリスト
- [ ] スプレッドシート作成（ナレッジ + 質問ログ）
- [ ] GAS設定 + デプロイ
- [ ] 質問ログシートの保護
- [ ] 企業に共有（編集者）
- [ ] tenants.json 追加
- [ ] Vercelデプロイ
- [ ] 企業にガイド・埋め込みコードを案内
