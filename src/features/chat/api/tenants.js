import fs from 'fs';
import path from 'path';

let tenantsCache = null;

/**
 * テナント設定ファイルを読み込む
 */
function loadTenants() {
  if (tenantsCache) return tenantsCache;

  const filePath = path.join(process.cwd(), 'config', 'tenants.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  tenantsCache = JSON.parse(raw);
  return tenantsCache;
}

/**
 * テナントIDからテナント設定を取得
 * @param {string} tenantId
 * @returns {object|null}
 */
export function getTenant(tenantId) {
  if (!tenantId || typeof tenantId !== 'string') return null;

  const tenants = loadTenants();
  const tenant = tenants[tenantId];

  if (!tenant) return null;

  return {
    id: tenantId,
    ...tenant,
  };
}

/**
 * 全テナントIDのリストを取得
 * @returns {string[]}
 */
export function getAllTenantIds() {
  const tenants = loadTenants();
  return Object.keys(tenants);
}

/**
 * 全テナントの許可オリジンリストを生成
 * @returns {string[]}
 */
export function getAllowedOrigins() {
  const tenants = loadTenants();
  const origins = new Set();

  // アプリ自身のURL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.add(process.env.NEXT_PUBLIC_APP_URL);
  }

  // 各テナントの許可オリジン
  for (const tenant of Object.values(tenants)) {
    if (tenant.allowedOrigins) {
      tenant.allowedOrigins.forEach((origin) => origins.add(origin));
    }
  }

  return Array.from(origins);
}

/**
 * テナント設定キャッシュをクリア（テスト用）
 */
export function clearTenantsCache() {
  tenantsCache = null;
}
