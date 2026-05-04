# tcy-homepage

[`@love-rox/tcy-*`](https://www.npmjs.com/org/love-rox) パッケージファミリーの公式サイト — [tcy.love-rox.cc](https://tcy.love-rox.cc)。

Web の縦書きに、縦中横の手触りを。`tate-chu-yoko` ユーティリティ／フレームワークアダプタ群（core / react / vue / rehype / astro）のランディング・デモ・ドキュメント・ブログを束ねた静的寄りの RSC サイトです。

---

## スタック

- **[Waku](https://waku.gg/)** — React Server Components ベースのフレームワーク
- **React 19** + React Compiler
- **Tailwind CSS v4** — `wa-modern` デザインシステム（墨 × 生成り × 朱）
- **Cloudflare Workers** — `@cloudflare/vite-plugin` 経由でデプロイ
- **Bun** — パッケージマネージャ／テストランナー
- **TypeScript** — strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`

## 必要環境

- [Bun](https://bun.sh/) (latest)
- Node.js ≥ 22（`wrangler` が Node 22+ を要求）

## セットアップ

```bash
bun install
bun run dev      # Waku dev server
```

## よく使うコマンド

| コマンド               | 用途                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| `bun run dev`          | Waku 開発サーバ                                                           |
| `bun run build`        | 本番ビルド（`prebuild` で npm から `@love-rox/tcy-*` の最新版を取得）     |
| `bun run start`        | ビルド成果物を `wrangler dev` で起動                                      |
| `bun run deploy`       | `wrangler deploy`（通常は CI が `main` プッシュで実行）                   |
| `bun run lint` / `fmt` | `vite-plus` (`vp check` / `vp fmt`)                                       |
| `bun test`             | Bun テストランナー                                                        |
| `bun run versions`     | npm レジストリから最新バージョンを取得して `src/lib/versions.ts` を再生成 |
| `bun run generate-seo` | `public/sitemap.xml` と `public/robots.txt` を再生成                      |
| `bun run cf-typegen`   | `wrangler.jsonc` から `worker-configuration.d.ts` を再生成                |

## ディレクトリ構成

```
src/
  pages/             ファイルベースルーティング（ja-default, /en/* が英語ミラー）
    _api/api/og.tsx  動的 OG 画像エンドポイント（workers-og）
    _layout.tsx      共通レイアウト（ヘッダ、フッタ、構造化データ）
  components/
    views/           各ページの実体（pages から locale を渡して呼ぶ）
    tcy/             tate-chu-yoko デモ用プリミティブ
    common, global, blog, seo
  lib/
    locale.ts        ja-default URL ヘルパー（localePath / detectLocale）
    markdown-loader.ts  ビルド時に Markdown を eager bundle（Workers に fs はない）
    og-helpers.ts    OG クエリ／フォントサイズの純粋関数（テスト対象）
    versions.ts      ★ 自動生成（手で編集しない）
  waku.server.tsx    Cloudflare adapter エントリポイント

private/
  contents/blog/{ja,en}/  ブログ Markdown
  lang/pages/{ja,en}/     ページ単位の i18n JSON
  lang/components/        コンポーネント単位の i18n JSON

public/                   静的アセット（sitemap.xml は生成物）
scripts/                  fetch-versions.ts / generate-seo-files.ts
tests/                    Bun テスト
.github/workflows/        CI / Deploy / Auto-merge
```

パスエイリアス：`@/*` → `src/*`、`@private/*` → `private/*`、`@content/*` → `private/contents/*`

## ロケール戦略

`ja` をデフォルトとし、英語版は `/en/...` にミラーする戦略です。

```
/             → 日本語ランディング（canonical）
/demo         → 日本語版
/blog/[slug]  → 日本語ブログ記事
/en           → 英語ランディング
/en/demo      → 英語版
/en/blog/[slug] → 英語ブログ記事
```

URL の組み立て・解析は必ず `src/lib/locale.ts` のヘルパー (`localePath`, `detectLocale`, `stripLocale`) を経由してください。`/en` プレフィックスを直接書かないのが原則です。

各ページは薄いシェルとして `src/pages/foo.tsx` ↔ `src/pages/en/foo.tsx` の 2 ファイルを置き、共通実体は `src/components/views/foo.tsx` に集約しています。

## コンテンツの追加

ブログ記事を追加する場合：

1. `private/contents/blog/ja/<slug>.md` と `private/contents/blog/en/<slug>.md` を作成
2. frontmatter に `title`, `description`, `date`, `author`, `tags` などを記述
3. 開発サーバを起動していればホットリロードで反映、`sitemap.xml` も自動再生成

`markdown-loader` がビルド時に Markdown を `import.meta.glob` で eager bundle するため、Cloudflare Workers ランタイムに `fs` を持ち込みません。

## デプロイ

`.github/workflows/deploy.yml` が以下のトリガで本番デプロイ（[love-rox.cc](https://love-rox.cc)）を実行します。

- `main` への `push`
- 週次 cron（月曜 06:00 UTC）— `tcy-*` の最新版を反映するためのセーフティネット
- `repository_dispatch: tcy-released` — `Love-Rox/tate-chu-yoko` のリリース時に発火

つまり npm への新リリース 〜 サイト更新まで概ね 1 分。手動でバージョン番号を書き換える必要はありません。

## CI / Auto-merge

- **CI** (`.github/workflows/ci.yml`): PR と `main` push で `bun run lint` と `bun test` を実行。
- **Auto-merge** (`.github/workflows/auto-merge.yml`): CI 成功後、オーナー PR を GitHub App 経由で admin-merge（squash + ブランチ削除）。GitHub ネイティブの auto-merge は ruleset bypass を尊重しないための回避策です。

## デザインシステム

「**wa-modern**」 — 墨 (sumi) のインクを生成り (kinari) の紙に落とし、朱 (shu) の朱印を一点だけ差すコンセプト。

- フォント: Shippori Mincho B1（明朝・縦組み主役）／ Zen Kaku Gothic New（和文ゴシック）／ Cormorant Garamond + Inter Tight（欧文）／ JetBrains Mono（コード・パッケージ名）
- カラー／タイポグラフィのトークンは `src/styles.css` で `@theme` 定義。`bg-ground` / `text-ink` / `bg-shu` / `font-mincho` などを再利用してください。

## ライセンス

Private (unpublished). サイトに表示されているサンプル文章は CC0 で扱える古典・著者作のものに限定しています。
