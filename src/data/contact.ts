/**
 * 連絡先メールアドレス。
 * 公開リポジトリにアドレスを残さないため、コードには書かずビルド時の環境変数 CONTACT_EMAIL から読む。
 * - ローカル: プロジェクト直下の .env に `CONTACT_EMAIL=...` を書く（.gitignore 済み）
 * - Cloudflare: Workers のビルド設定の変数に CONTACT_EMAIL を登録する
 * 未設定ならメールボタンは表示しない。
 */
const raw: string = process.env.CONTACT_EMAIL ?? import.meta.env.CONTACT_EMAIL ?? '';
const email = raw.trim();

export const contactEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : '';

/** HTML にアドレスをそのまま出さないよう、ユーザー名とドメインに分けて渡す */
export const contactEmailParts: [string, string] | [] = contactEmail
  ? (contactEmail.split('@') as [string, string])
  : [];
