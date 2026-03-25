/**
 * ========================================
 * 採用Q&Aチャットボット - GAS Web API
 * ========================================
 *
 * 【このスクリプトの設置方法】
 * 1. スプレッドシートを開く
 * 2. 「拡張機能」→「Apps Script」
 * 3. このコードを貼り付けて保存
 * 4. 「デプロイ」→「新しいデプロイ」
 *    - 種類: ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセス: 全員
 * 5. デプロイURLをコピー
 *
 * 【シート構成】
 * ・「ナレッジ」シート: A列=カテゴリ, B列=項目, C列=内容（1行目はヘッダー）
 * ・「質問ログ」シート: A列=タイムスタンプ, B列=セッションID, C列=質問, D列=回答, E列=カテゴリ
 */

/**
 * GETリクエスト: 企業情報データを返す
 */
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === 'getKnowledge') {
      return getKnowledge();
    }

    return createJsonResponse({ error: '不明なアクションです' }, 400);

  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * POSTリクエスト: 質問ログを書き込む
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'appendLog') {
      return appendLog(data);
    }

    return createJsonResponse({ error: '不明なアクションです' }, 400);

  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * ナレッジシートから企業情報データを取得
 * 列構成: A=カテゴリ, B=項目, C=内容
 */
function getKnowledge() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ナレッジ');

  if (!sheet) {
    return createJsonResponse({ error: '「ナレッジ」シートが見つかりません' }, 404);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return createJsonResponse({ data: [] });
  }

  var range = sheet.getRange(2, 1, lastRow - 1, 3);
  var values = range.getValues();

  var knowledge = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row[0] && row[1] && row[2]) {
      knowledge.push({
        category: String(row[0]).trim(),
        item: String(row[1]).trim(),
        content: String(row[2]).trim()
      });
    }
  }

  return createJsonResponse({ data: knowledge });
}

/**
 * 質問ログシートにログを追記
 */
function appendLog(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('質問ログ');

  if (!sheet) {
    return createJsonResponse({ error: '「質問ログ」シートが見つかりません' }, 404);
  }

  var timestamp = Utilities.formatDate(
    new Date(),
    'Asia/Tokyo',
    'yyyy/MM/dd HH:mm:ss'
  );

  sheet.appendRow([
    timestamp,
    data.sessionId || '',
    data.question || '',
    data.answer || '',
    data.category || ''
  ]);

  return createJsonResponse({ success: true });
}

/**
 * JSONレスポンスを生成
 */
function createJsonResponse(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
