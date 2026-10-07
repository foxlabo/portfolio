# portfolio

エンジニアの自己紹介サイトです。Astro で静的サイトとして生成し、Cloudflare Workers（静的アセット配信）で公開します。

- ヒーロー背景: WebGL シェーダー（マウスに反応。動きを減らす設定の人には静止画）
- 本文: ダーク基調の Bento レイアウト。カーソルに合わせてカードの縁が光る
- 隠し機能: `/` キー、またはナビの `>_` ボタンでターミナルが開く

## 必要なもの

- Node.js 22 以上（`.node-version` で 22 を指定しています。fnm を使っている場合は `fnm use` で切り替わります）

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm install` | 依存パッケージのインストール |
| `npm run dev` | 開発サーバー（http://localhost:4321） |
| `npm run build` | `dist/` に静的ファイルを出力 |
| `npm run preview` | ビルド済みの `dist/` を配信して確認 |
| `npm run preview:cf` | ビルドして Cloudflare と同じ環境（wrangler dev）で確認 |
| `npm run check` | 型チェック（`astro check`） |
| `npm run test:e2e` | E2E・アクセシビリティテスト（Playwright + axe-core。先に `npm run build` が必要） |
| `npm run deploy` | ビルドして Cloudflare に直接デプロイ（初回は `npx wrangler login` が必要） |

## CI

`.github/workflows/ci.yml` で、push と Pull Request のたびに次を実行します。

1. 型チェック（`npm run check`）
2. ビルド（`npm run build`）
3. E2E テスト（デスクトップ・モバイル）: 各セクションの表示、横スクロールがないこと、ターミナルの操作、404 ページ
4. アクセシビリティ（axe-core で WCAG 2.0 A/AA の重大な違反がないこと）
5. 公開してはいけない情報のチェック（HTML にメールアドレスや電話番号がそのまま含まれていないこと）

## 内容の編集

表示する内容はすべて [`src/data/profile.ts`](src/data/profile.ts) にまとめています。名前・紹介文・制作物・経歴・リンクを書き換えると、ページとターミナルの両方に反映されます。

- Writing セクションは、ビルド時に `noteUser` の RSS から最新 6 件を取得します（取得できないときは `articles` を表示）。記事を書いたら再デプロイすると反映されます
- 連絡先メールアドレスは**リポジトリに書かず**、環境変数 `CONTACT_EMAIL` で渡します（[`src/data/contact.ts`](src/data/contact.ts)）。ローカルでは `.env.example` をコピーして `.env` に書いてください（`.env` は `.gitignore` 済み）。設定すると Contact とターミナルにメールボタンが出ます。収集ボット対策として、HTML には分割した形でしか出力しません
- `private: true` の制作物は「ソース非公開」と表示されます
- 制作物に画像を使う場合は `public/works/` に置いて `image: '/works/xxx.png'` を指定します。画像がなければ `hue`（色相）から抽象的なサムネイルを作ります
- `featured: true` の制作物は横長の大きいカードになります
- 公開 URL が決まったら [`astro.config.mjs`](astro.config.mjs) の `site` を書き換えてください（canonical と OGP に使われます）
- OGP 画像（1200×630）を用意したら `public/` に置き、`site.ogImage` にパスを入れてください

## 構成

```
src/
  data/profile.ts        表示内容（ここだけ編集すれば OK）
  layouts/Layout.astro   <head>・メタタグ・フォント
  components/
    Nav.astro            固定ナビ（スクロール位置に応じてハイライト）
    Hero.astro           シェーダー背景のヒーロー
    About.astro          Bento グリッド（プロフィール・数字で見る実績・時計・経験年数など）
    Works.astro          制作物
    Writing.astro        note の最新記事（data/articles.ts でビルド時に取得）
    Experience.astro     経歴タイムライン
    Contact.astro        連絡先
    Terminal.astro       隠しターミナル（<dialog>）
  scripts/
    shader.ts            WebGL シェーダー
    glow.ts              カードの発光エフェクト
  styles/global.css      デザイントークンと共通スタイル
wrangler.jsonc           Cloudflare Workers の設定（dist/ を配信）
```

## Cloudflare への公開（GitHub 連携）

1. GitHub に新しいリポジトリを作って push する
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/portfolio.git
   git push -u origin main
   ```
2. Cloudflare ダッシュボード → **Workers & Pages** → **Create** → **Import a repository** でリポジトリを選ぶ
3. ビルド設定
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Build variables: `CONTACT_EMAIL` に連絡先メールアドレスを登録（ビルド時に読み込まれます）
4. 以降は `main` に push するたびに自動でデプロイされます。`https://portfolio.<アカウント>.workers.dev` で公開されます
5. 独自ドメインを使う場合は、Worker の **Settings → Domains & Routes** から追加します

## ターミナルのコマンド

`help` `about` `skills` `works` `writing` `experience` `contact` `neofetch` `open <section>` `clear` `exit`
（ほかにも `ls` `cd` `whoami` `sudo` などの隠しコマンドがあります。追加は `Terminal.astro` の `commands` に書きます）
