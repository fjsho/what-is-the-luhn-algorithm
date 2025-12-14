# Research & Design Decisions

---
**Purpose**: Luhnアルゴリズム学習・検証SPAの設計に必要な調査結果とアーキテクチャ決定の根拠を記録
---

## Summary
- **Feature**: `luhn-validator-spa`
- **Discovery Scope**: New Feature (greenfield)
- **Key Findings**:
  - Luhnアルゴリズムの実装は関数型配列メソッド(map, reduce)を使った実装が推奨される
  - Vite + TypeScript + Tailwind CSSのセットアップは標準的なテンプレートが確立されている
  - 固定配置フォームの実装はfixed positioning(`fixed top-4 right-4`)で実現可能、アクセシビリティ考慮が必要

## Research Log

### Luhnアルゴリズム実装パターン
- **Context**: TypeScriptでのLuhnアルゴリズムの効率的かつ保守性の高い実装方法を調査
- **Sources Consulted**:
  - [30 Seconds of Typescript - luhnCheck](https://decipher.dev/30-seconds-of-typescript/docs/luhnCheck/)
  - [GitHub - tolbon/luhn-ts](https://github.com/tolbon/luhn-ts)
  - [30 seconds of code - Luhn Check](https://www.30secondsofcode.org/js/s/luhn-check/)
- **Findings**:
  - 推奨される実装: `String.prototype.split()`, `Array.prototype.reverse()`, `Array.prototype.map()`でdigit配列を作成
  - `Array.prototype.splice(0, 1)`で最後の桁を取得、`Array.prototype.reduce()`でアルゴリズムを実装
  - パフォーマンス最適化: 2倍した数値の計算結果をルックアップテーブル(配列)に事前計算して保存
  - TypeScriptパッケージは存在するが、教育目的のため独自実装を推奨
- **Implications**:
  - 純粋関数として実装し、テストとメンテナンスを容易にする
  - 型安全性を確保するため入力バリデーションを厳密に行う

### Vite + TypeScript + Tailwind CSS プロジェクト構成
- **Context**: 2025年時点での標準的なプロジェクトセットアップと構成を確認
- **Sources Consulted**:
  - [Install Tailwind CSS with Vite - Tailwind CSS](https://tailwindcss.com/docs/guides/vite)
  - [Medium - React + TypeScript + Tailwind with Vite](https://medium.com/@pushpendrapal_/how-to-setup-react-typescript-and-tailwind-css-with-vite-in-a-project-8d9b0b51d1bd)
  - [Medium - Tailwind 4.0 + Vite](https://medium.com/@npguapo/installation-of-tailwind-vite-react-javascript-or-typescript-ec1abdfa56b2)
- **Findings**:
  - セットアップ手順: `npm create vite@latest` → TypeScriptテンプレート選択 → Tailwind CSSインストール
  - Tailwind 4.0(2025最新): `vite.config.ts`に`@tailwindcss/vite`プラグイン追加、`src/index.css`に`@import "tailwindcss";`
  - 標準構成: `src/main.ts`(エントリーポイント), `index.html`(シングルHTML), `vite.config.ts`, `tailwind.config.js`
  - PostCSS設定は`npx tailwindcss init -p`で自動生成
- **Implications**:
  - プロジェクト初期化は標準テンプレートを活用
  - Tailwind 4.0の新しい設定方法を採用して最新のベストプラクティスに従う

### 固定配置フォームとアクセシビリティ
- **Context**: スクロール追随する浮動フォームの実装方法とアクセシビリティ上の考慮事項を調査
- **Sources Consulted**:
  - [Tailwind CSS - Position](https://tailwindcss.com/docs/position)
  - [Tailwind UI Sticky Navigation - Tailkits](https://tailkits.com/blog/tailwind-ui-sticky-navigation/)
  - [TW Elements - Position Sticky](https://tw-elements.com/docs/standard/extended/position-sticky/)
- **Findings**:
  - Fixed positioning: `fixed top-4 right-4`でビューポート基準の固定配置
  - Sticky vs Fixed: Stickyは閾値まで相対配置→固定、Fixedは常に固定
  - アクセシビリティ: 固定要素がコンテンツを隠さないようzIndexとパディング調整が必要
  - スクロール可能性の確保: 固定要素の高さ分だけbodyにpadding追加を検討
- **Implications**:
  - フォームは`fixed`で実装し、解説コンテンツの閲覧を妨げない配置(右上または右下)
  - モバイル対応も考慮し、レスポンシブブレークポイントで配置変更を検討

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Simple Module Pattern | 機能ごとにモジュール分離(`luhn.ts`, `validator.ts`, `main.ts`) | シンプルで理解しやすい、小規模SPAに最適 | スケール性は限定的 | tech.mdの推奨構成と一致 |
| MVC Pattern | Model(Luhnロジック), View(HTML), Controller(validator) | 明確な責務分離 | 小規模プロジェクトには過剰 | 不採用 |
| Component-based (React/Vue) | UIコンポーネント化 | 再利用性とメンテナンス性が高い | 依存関係増加、バンドルサイズ増 | 要件(シンプル・軽量)に反するため不採用 |

**選択**: Simple Module Patternを採用。教育的かつシンプルな構成を維持し、技術的負債を最小化。

## Design Decisions

### Decision: TypeScriptの型安全性戦略
- **Context**: 要件4.2で型定義を適切に行い型安全性を確保する必要がある
- **Alternatives Considered**:
  1. strict: true — すべての厳密チェックを有効化
  2. noImplicitAny: true のみ — 基本的な型チェック
- **Selected Approach**: tech.mdに従い、noImplicitAny: true、strict: falseの基本的な型チェック
- **Rationale**: 学習目的のプロジェクトであり、過度な型厳密性は複雑さを増す。コアロジック(`luhn.ts`)では厳密な型定義を行い、DOM操作では柔軟性を保つ
- **Trade-offs**:
  - メリット: 実装の容易さ、初心者にも理解しやすい
  - デメリット: nullチェックの自動化なし、潜在的なランタイムエラーのリスク
- **Follow-up**: 実装時にコアロジックの型定義を優先的にレビュー

### Decision: Luhnアルゴリズムの実装方式
- **Context**: 教育的価値とパフォーマンスのバランス
- **Alternatives Considered**:
  1. NPMパッケージ使用 (`luhn-ts`) — 実装不要、すぐ使える
  2. 独自実装(関数型) — 学習価値、カスタマイズ可能
  3. 独自実装(ルックアップテーブル最適化) — 高パフォーマンス
- **Selected Approach**: 独自実装(関数型)、オプションでルックアップテーブル最適化をコメントで紹介
- **Rationale**: 教育目的のサイトであり、アルゴリズムの理解を深めるため独自実装が適切。パフォーマンスは小規模入力で問題にならない
- **Trade-offs**:
  - メリット: 学習価値、コードの透明性
  - デメリット: 開発時間増、既存パッケージの信頼性は享受できない
- **Follow-up**: 実装コードにステップバイステップのコメントを追加

### Decision: フォーム配置とレスポンシブ対応
- **Context**: 要件3で固定配置のスクロール追随フォームが必要
- **Alternatives Considered**:
  1. デスクトップ/モバイル共通で`fixed top-4 right-4`
  2. レスポンシブで配置変更(デスクトップ: 右上、モバイル: 下部固定)
- **Selected Approach**: レスポンシブ対応を採用。デスクトップは`fixed top-4 right-4`、モバイルは`fixed bottom-0 w-full`
- **Rationale**: モバイルでは右上配置が親指で操作しにくく、UX低下の恐れ。下部固定で操作性向上
- **Trade-offs**:
  - メリット: モバイルUX向上、アクセシビリティ改善
  - デメリット: 実装複雑性わずかに増加(Tailwindブレークポイント使用)
- **Follow-up**: モバイルでの実機テスト実施

## Risks & Mitigations
- **Risk 1: 固定フォームがコンテンツを隠す** — Mitigation: z-index調整、解説コンテンツに適切なpaddingを追加
- **Risk 2: 入力バリデーションの不備** — Mitigation: 正規表現での数値チェック、空文字・非数値のエラーハンドリング実装
- **Risk 3: モバイルでのフォーム操作性** — Mitigation: レスポンシブデザインで下部固定配置、タッチ操作を考慮したボタンサイズ

## References
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Tailwind CSSの公式ドキュメント
- [Vite Guide](https://vitejs.dev/guide/) — Viteの公式ガイド
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — TypeScript公式ハンドブック
- [30 Seconds of Code - Luhn Check](https://www.30secondsofcode.org/js/s/luhn-check/) — Luhnアルゴリズムの実装リファレンス
