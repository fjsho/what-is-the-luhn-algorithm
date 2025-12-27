# Requirements Document

## Project Description (Input)
github actions で ビルドしてgithubpagesに公開するワークフローを実装

## Introduction
本仕様は、GitHub Actionsを使用してVite+TypeScriptプロジェクトを自動ビルドし、GitHub PagesへデプロイするCI/CDワークフローの要件を定義します。コードがmainブランチにpushされると、自動的にビルドが実行され、静的サイトとしてGitHub Pagesで公開されます。

## Requirements

### Requirement 1: 自動ビルドトリガー
**Objective:** As a 開発者, I want コードをmainブランチにpushした際に自動的にビルドが実行される, so that 手動デプロイの手間を削減し、常に最新版を公開できる

#### Acceptance Criteria
1. When mainブランチにpushされた, the GitHub Actions Workflow shall ビルドジョブを自動的にトリガーする
2. When Pull Requestがmainブランチにマージされた, the GitHub Actions Workflow shall ビルドジョブを自動的にトリガーする
3. The GitHub Actions Workflow shall 手動トリガー(workflow_dispatch)をサポートする

### Requirement 2: 依存関係のインストールとビルド
**Objective:** As a CI/CDシステム, I want プロジェクトの依存関係をインストールしてビルドを実行する, so that デプロイ可能な静的ファイルを生成できる

#### Acceptance Criteria
1. The GitHub Actions Workflow shall Node.js環境をセットアップする
2. The GitHub Actions Workflow shall `npm install`で依存関係をインストールする
3. The GitHub Actions Workflow shall `npm run build`でViteビルドを実行する
4. The GitHub Actions Workflow shall ビルド成果物(dist/ディレクトリ)を生成する
5. If ビルドが失敗した, then the GitHub Actions Workflow shall ワークフローを停止しエラーを報告する

### Requirement 3: テストの実行
**Objective:** As a 開発者, I want デプロイ前にテストを実行する, so that 品質の低いコードが本番環境に公開されるのを防ぐ

#### Acceptance Criteria
1. The GitHub Actions Workflow shall ビルド前に`npm test`を実行する
2. If テストが失敗した, then the GitHub Actions Workflow shall ワークフローを停止しデプロイをスキップする
3. The GitHub Actions Workflow shall テスト結果をワークフローログに出力する

### Requirement 4: GitHub Pagesへのデプロイ
**Objective:** As a CI/CDシステム, I want ビルド成果物をGitHub Pagesに自動デプロイする, so that ユーザーが最新版のサイトにアクセスできる

#### Acceptance Criteria
1. When ビルドとテストが成功した, the GitHub Actions Workflow shall dist/ディレクトリの内容をGitHub Pagesにデプロイする
2. The GitHub Actions Workflow shall GitHub Pages公式アクション(actions/deploy-pages等)を使用する
3. The GitHub Actions Workflow shall デプロイ完了後にサイトのURLをワークフローログに出力する
4. The GitHub Actions Workflow shall GitHub Pages Artifactを使用してmainブランチから直接デプロイする

### Requirement 5: ワークフロー設定ファイルの配置
**Objective:** As a 開発者, I want ワークフロー設定を適切な場所に配置する, so that GitHubがワークフローを認識し実行できる

#### Acceptance Criteria
1. The ワークフロー設定ファイル shall `.github/workflows/`ディレクトリに配置される
2. The ワークフロー設定ファイル shall YAML形式で記述される
3. The ワークフロー設定ファイル shall 明確なファイル名(例: `deploy.yml`, `gh-pages.yml`)を持つ
4. The ワークフロー設定ファイル shall バージョン管理(Git)に含まれる

### Requirement 6: 環境変数とパーミッション
**Objective:** As a CI/CDシステム, I want 必要なパーミッションと環境変数を設定する, so that GitHub Pagesへのデプロイが正常に動作する

#### Acceptance Criteria
1. The GitHub Actions Workflow shall `GITHUB_TOKEN`を使用してGitHub Pagesにアクセスする
2. The GitHub Actions Workflow shall `contents: read`および`pages: write`パーミッションを持つ
3. The GitHub Actions Workflow shall `id-token: write`パーミッション(GitHub Pages Artifact使用時)を持つ
4. If 必要なパーミッションが不足している, then the GitHub Actions Workflow shall エラーメッセージを出力してワークフローを停止する

### Requirement 7: ビルドキャッシュの最適化
**Objective:** As a 開発者, I want ビルド時間を短縮する, so that デプロイが高速化される

#### Acceptance Criteria
1. The GitHub Actions Workflow shall `node_modules`をキャッシュする
2. The GitHub Actions Workflow shall キャッシュキーにpackage-lock.jsonのハッシュを使用する
3. When キャッシュが利用可能な場合, the GitHub Actions Workflow shall キャッシュから依存関係を復元する
4. When キャッシュが存在しない場合, the GitHub Actions Workflow shall 依存関係をインストールしキャッシュを保存する
