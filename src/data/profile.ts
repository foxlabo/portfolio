/**
 * サイトに表示する内容はすべてこのファイルで管理します。
 * 文章・リンク・制作物・経歴を書き換えれば、ページとターミナルの両方に反映されます。
 */

export type LinkIcon = 'github' | 'x' | 'pen' | 'link';

export interface Work {
  title: string;
  year: string;
  summary: string;
  tags: string[];
  /** サムネイル画像がないときに使う色相（0〜360） */
  hue: number;
  /** public/ 以下に置いた画像のパス（例: '/works/alpha.png'） */
  image?: string;
  repo?: string;
  /** repo リンクの表示名（省略時は "Code"） */
  repoLabel?: string;
  /** ソースを公開していない作品なら true（「ソース非公開」と表示） */
  private?: boolean;
  live?: string;
  /** live リンクの表示名（省略時は "Live"） */
  liveLabel?: string;
  /** true にすると横長の大きいカードで表示 */
  featured?: boolean;
}

export interface Experience {
  period: string;
  role: string;
  org: string;
  summary: string;
  tags: string[];
  current?: boolean;
}

export interface Article {
  title: string;
  date: string;
  url: string;
}

/** 配列の要素に型を付けつつ、書き間違えたプロパティを検出するためのヘルパー */
const list = <T,>(items: T[]) => items;

export const profile = {
  name: '新坂 涼',
  nameEn: 'Ryo Shinsaka',
  handle: 'ryo',
  initials: 'RS',
  role: 'Full-stack Engineer / PM',
  location: 'Japan',
  timezone: 'Asia/Tokyo',
  openToWork: true,

  site: {
    title: '新坂 涼 — Full-stack Engineer / PM',
    description:
      '要件定義から設計・実装・運用までを一貫して担う、マネジメント志向のフルスタックエンジニア 新坂 涼のポートフォリオ。生成AIを活用した開発と個人開発プロダクトを紹介しています。',
    /** public/ 以下に置いた OGP 画像（1200×630）。用意したらパスを入れてください */
    ogImage: '',
  },

  tagline: {
    lead: 'From requirements',
    accent: 'to AI-powered delivery.',
  },
  intro:
    '要件定義から設計・実装・運用までを一貫して担う、マネジメント志向のフルスタックエンジニアです。Claude Code／Codex を駆使した AI 駆動開発で、現場の課題をすばやく確かな形にします。',

  about: [
    'エンジニア歴 8 年以上。金融・医療・エンタメ・物流などの業務システムを中心に、2〜50 名規模のプロジェクトで要件定義から開発・運用保守までを担当してきました。最大 33 名規模でプロジェクトリーダー、10 名規模でプロジェクトマネージャーとしてチームを牽引した経験があります。',
    '現在はフリーランスとして、生成 AI を活用した Web サービス（RAG チャットボット、AI 面接、画像解析 AI）のフルスタック開発に参画しています。Claude Code・Codex を開発の各工程に取り入れつつ、設計判断と品質の担保は自分で行う「AI 駆動開発」を実践しています。',
  ],

  /** About の「数字で見る」カード */
  highlights: [
    { value: '8+', unit: '年', label: 'エンジニア歴' },
    { value: '33', unit: '名', label: 'PL として率いた最大チーム' },
    { value: '50', unit: '名', label: '参画した最大規模の開発' },
    { value: '8', unit: '件', label: 'GitHub で公開中の個人開発' },
  ],

  now: [
    '生成 AI × Web サービスのフルスタック開発（RAG・音声 AI・画像解析）',
    '金融機関向けシステムでの AI 駆動開発の実践とチームへの展開',
    'note で Claude Code／Codex など生成 AI 開発の知見を発信',
  ],

  stack: [
    'TypeScript',
    'Next.js',
    'React',
    'Hono',
    'Fastify',
    'Java',
    'Spring Boot',
    'C# / .NET',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Oracle',
    'AWS',
    'Azure',
    'Terraform',
    'Docker',
    'Claude Code',
    'Codex',
  ],

  /** 経験期間（月数）。バーの長さは最長の経験に対する割合 */
  skills: [
    { name: 'Linux', months: 99 },
    { name: 'Oracle', months: 69 },
    { name: 'Java / Spring Boot', months: 60 },
    { name: 'C# / .NET', months: 36 },
    { name: 'TypeScript / React', months: 27 },
    { name: 'PostgreSQL', months: 27 },
    { name: 'Docker', months: 27 },
    { name: 'PM', months: 24 },
    { name: 'Python / FastAPI', months: 21 },
    { name: 'Claude Code', months: 15 },
  ],

  works: list<Work>([
    {
      title: 'Tsumugi',
      image: '/works/tsumugi.webp',
      year: '2026',
      summary:
        'AI パネルを搭載した Windows 向けのテキストエディタ。文字コードの自動判定、grep、Markdown プレビューを備え、OpenAI／Anthropic／Gemini／Ollama や Claude Code・Codex CLI など 7 種類の AI を切り替えて使えます。インストーラーを GitHub Releases で配布しています。',
      tags: ['Tauri 2', 'Rust', 'Next.js 16', 'React 19', 'Monaco Editor'],
      hue: 265,
      repo: 'https://github.com/foxlabo/tsumugi',
      live: 'https://github.com/foxlabo/tsumugi/releases',
      liveLabel: 'Download',
      featured: true,
    },
    {
      title: 'AI VTuber Engine',
      year: '2026',
      summary:
        'オリジナルの AI VTuber を自律配信させるエンジン。Twitch コメントへの応答、音声合成と口パク・表情制御、OBS 操作、長期記憶、安全フィルタ、視聴者参加型のミニゲームまでを統合しています。LLM は OpenAI／Claude Code／Codex CLI を切り替え可能。本体は非公開で、前身の汎用版 ai-tube-engine を公開しています。',
      tags: ['Python', 'asyncio', 'OpenAI / Claude', 'faster-whisper', 'VTube Studio', 'OBS', 'Twitch'],
      hue: 330,
      repo: 'https://github.com/foxlabo/ai-tube-engine',
      repoLabel: '公開版 ai-tube-engine',
      featured: true,
    },
    {
      title: 'MeetQ',
      image: '/works/meetq.webp',
      year: '2026',
      summary:
        '会議にボットを参加させず、PC の再生音声をそのまま取り込んで文字起こしし、発言を根拠として引用しながら「次に聞くべき質問」を AI が提案するローカル Web アプリ。リアルタイムの文字起こしと定期的な質問生成に対応しています。',
      tags: ['Python', 'FastAPI', 'React', 'OpenAI Realtime API', 'Structured Outputs'],
      hue: 190,
      private: true,
      featured: true,
    },
    {
      title: 'Recepita',
      year: '2026',
      summary:
        'フリーランス向けの経費・請求書管理 SaaS。レシートを撮影するだけで、OCR → AI によるカテゴリ推定 → 経費登録までを自動化します。',
      tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Azure OpenAI', 'Document Intelligence'],
      hue: 160,
      repo: 'https://github.com/foxlabo/Recepita',
    },
    {
      title: 'Akari',
      image: '/works/akari.webp',
      year: '2026',
      summary: 'マルチプロバイダ対応のローカル AI チャット。ストリーミング応答、ペルソナ管理、会話のローカル保存に対応しています。',
      tags: ['Next.js 16', 'Vercel AI SDK', 'SQLite', 'Drizzle'],
      hue: 35,
      repo: 'https://github.com/foxlabo/akari',
    },
    {
      title: 'Origami',
      image: '/works/origami.webp',
      year: '2026',
      summary: 'ノーコードでチャットボットの会話フローを設計できるビジュアルビルダー。ノードグラフで分岐を組み、その場でライブテストできます。',
      tags: ['Next.js 16', 'React Flow', 'Vercel AI SDK', 'SQLite'],
      hue: 220,
      repo: 'https://github.com/foxlabo/origami',
    },
    {
      title: 'Kioku',
      image: '/works/kioku.webp',
      year: '2026',
      summary: '自分の Markdown ノートを根拠に、AI が引用付きで回答する RAG 構成のノートアプリ。',
      tags: ['Next.js 16', 'RAG', 'Vercel AI SDK', 'SQLite'],
      hue: 290,
      repo: 'https://github.com/foxlabo/kioku',
    },
    {
      title: 'Hoshi',
      image: '/works/hoshi.webp',
      year: '2026',
      summary: 'フォルダを指定するだけで、撮影日ごとのタイムライン・アルバム・検索が使えるローカルの写真ライブラリ。EXIF 解析とサムネイル生成を自前で実装しています。',
      tags: ['Next.js 16', 'Tailwind 4', 'SQLite', 'Drizzle', 'sharp'],
      hue: 50,
      repo: 'https://github.com/foxlabo/hoshi',
    },
    {
      title: 'Toki',
      image: '/works/toki.webp',
      year: '2026',
      summary: '空き時間を登録すると、公開リンクからゲストが予約できる日程調整アプリ。タイムゾーンと予約枠の計算、ダブルブッキングを防ぐ書き込み処理を実装しています。',
      tags: ['Next.js 16', 'SQLite', 'Drizzle', 'Zod'],
      hue: 120,
      repo: 'https://github.com/foxlabo/toki',
    },
  ]),

  /** 社名・案件名は守秘義務に配慮して業界名で記載 */
  experience: list<Experience>([
    {
      period: '2026.08 — 現在',
      role: 'フルスタックエンジニア',
      org: '生成 AI 系 Web サービス開発（フリーランス・複数案件）',
      summary:
        'RAG チャットボット、AI 面接システム、車両画像解析 AI の開発に参画。要件定義から Next.js／Hono／Fastify によるフルスタック開発、pgvector＋PGroonga のハイブリッド RAG、OpenAI・Claude・Amazon Bedrock を使った AI 機能、Terraform／GitHub Actions による AWS 基盤構築までを担当。',
      tags: ['Next.js', 'Hono', 'Fastify', 'PostgreSQL', 'Terraform', 'OpenAI / Claude'],
      current: true,
    },
    {
      period: '2026.01 — 現在',
      role: 'シニアエンジニア',
      org: '金融機関向け市場リスク計算システム（フリーランス・50 名規模）',
      summary:
        '業務要件のヒアリングと仕様書作成、コードレビューを担当。Codex を使った AI 駆動開発で要件整理からテスト・レビューまでの各工程を効率化し、チームへ活用ノウハウを共有。',
      tags: ['Java', 'Spring Boot', 'Python', 'AWS', 'Codex'],
      current: true,
    },
    {
      period: '2024.01 — 2025.12',
      role: 'プロジェクトマネージャー',
      org: '医療機器メーカー向け基幹システム（フリーランス・10 名規模）',
      summary:
        'RFID／IoT による所在管理・棚卸の自動化など、顧客の DX を企画・推進。計画立案、WBS・進捗・品質管理、提案書や RFP の作成支援を担当し、Claude Code・Cursor をチームに導入。',
      tags: ['PM', 'Azure', 'Java', 'C#', 'Next.js'],
    },
    {
      period: '2020.07 — 2023.12',
      role: 'プロジェクトリーダー',
      org: '外資系コンサルティングファーム（正社員・最大 33 名）',
      summary:
        'OTC デリバティブ取引管理システムを要件定義からリリース・保守運用まで統括。見積・進捗・品質・リスク管理、オフショアを含むチームのマネジメントと若手育成を担当。',
      tags: ['Java', 'C#', 'Oracle', 'Linux'],
    },
    {
      period: '2018.04 — 2020.06',
      role: 'エンジニア',
      org: '独立系 SIer（正社員）',
      summary:
        '映画興行会社向け POS・基幹システム、資料発送管理システムの設計・開発・運用保守。自動釣銭機対応や軽減税率対応を仕様検討からテストまで一貫して担当。',
      tags: ['Java', 'C#', 'Oracle', 'VBA'],
    },
  ]),

  /** note の記事はビルド時に RSS から最新分を取得。取得できないときは下の articles を表示 */
  noteUser: 'shinsary',
  articles: [
    {
      title: 'Codex CLI 完全ガイド ― インストールから自動化・チーム運用まで',
      date: '2026-06-19',
      url: 'https://note.com/shinsary/n/nb61e2db4ae62',
    },
  ] satisfies Article[],

  links: [
    { label: 'GitHub', href: 'https://github.com/foxlabo', icon: 'github' },
    { label: 'note', href: 'https://note.com/shinsary', icon: 'pen' },
  ] satisfies { label: string; href: string; icon: LinkIcon }[],

  // メールアドレスはここに書かず、環境変数 CONTACT_EMAIL で渡す（src/data/contact.ts を参照）
};
