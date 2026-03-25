# マルチテナント構成ガイド

## 全体像

```mermaid
graph TD
    subgraph "Vercel（アプリ1つ）"
        APP["chatbot-app"]
        TJ["tenants.json"]
        API["API /api/chat"]
        AI["Gemini AI"]
    end

    subgraph "A社の採用サイト"
        WA["widget.js<br/>data-tenant='company-a'"]
    end

    subgraph "B社の採用サイト"
        WB["widget.js<br/>data-tenant='company-b'"]
    end

    subgraph "Google（あなたが管理）"
        SSA["スプレッドシート A社"]
        SSB["スプレッドシート B社"]
        GASA["GAS A社"]
        GASB["GAS B社"]
    end

    WA -->|"tenant=company-a"| API
    WB -->|"tenant=company-b"| API
    API --> TJ
    TJ -->|"A社のGAS URL取得"| GASA
    TJ -->|"B社のGAS URL取得"| GASB
    GASA --> SSA
    GASB --> SSB
    API --> AI
```

## 新しい企業を追加する流れ（3ステップ）

```mermaid
graph LR
    subgraph "STEP 1：スプレッドシート作成"
        S1["Google Sheetsで<br/>新規作成"]
        S2["ナレッジ＋質問ログ<br/>シートを作る"]
        S3["GASスクリプト<br/>を貼り付け"]
        S4["デプロイして<br/>URL取得"]
        S1 --> S2 --> S3 --> S4
    end
```

```mermaid
graph LR
    subgraph "STEP 2：tenants.json に1行追加"
        T1["tenants.json を開く"]
        T2["企業ID・名前・<br/>GAS URLを追加"]
        T3["git push"]
        T1 --> T2 --> T3
    end
```

```mermaid
graph LR
    subgraph "STEP 3：企業に案内"
        U1["スプレッドシートを<br/>企業に共有"]
        U2["埋め込みコードを<br/>メールで送付"]
        U3["企業がサイトに<br/>1行貼るだけ"]
        U1 --> U2 --> U3
    end
```

## 具体例：C社を追加する場合

### STEP 1. スプレッドシートを作る

あなたのGoogleドライブで新規スプレッドシートを作成し、GASを設定してURLを取得。

### STEP 2. tenants.json に追加

```json
{
  "demo": { ... },
  "company-c": {
    "name": "C社株式会社",
    "gasUrl": "https://script.google.com/macros/s/zzz/exec",
    "allowedOrigins": ["https://c-company.co.jp"],
    "blockedTopics": [],
    "customRules": []
  }
}
```

`git push` → Vercelが自動デプロイ（約30秒）

### STEP 3. 企業に案内メール

> C社ご担当者様
>
> チャットボットの準備が完了しました。
>
> ■ 企業情報の入力
> 共有したスプレッドシートの「ナレッジ」シートに御社の情報をご入力ください。
> 入力方法はこちら → https://your-app.vercel.app/setup
>
> ■ サイトへの設置
> 以下の1行を採用ページのHTMLに追加してください。
> ```
> <script src="https://your-app.vercel.app/widget.js" data-tenant="company-c"></script>
> ```

## 所要時間の目安

| 作業 | 時間 |
|------|------|
| スプレッドシート＋GAS作成 | 5分 |
| tenants.json追加＋デプロイ | 2分 |
| 企業への案内メール | 3分 |
| **合計** | **約10分/社** |
