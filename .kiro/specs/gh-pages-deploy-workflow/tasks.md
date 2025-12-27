# Implementation Plan

## Task Overview
本実装計画は、GitHub Actionsワークフローを段階的に構築し、GitHub Pagesへの自動デプロイを実現するためのタスクを定義します。ワークフロー設定ファイルの作成から始まり、ビルド・テスト・デプロイの各ステップを順次実装します。

## Tasks

- [x] 1. ワークフロー設定ファイルの作成と基本構造の定義
- [x] 1.1 (P) .github/workflows/ディレクトリを作成し、deploy.ymlファイルを配置
  - リポジトリのルートに`.github/workflows/`ディレクトリを作成
  - `deploy.yml`という明確な名前でワークフロー設定ファイルを作成
  - YAML形式の基本構造(name, on, permissions, concurrency)を記述
  - _Requirements: 5_

- [x] 1.2 (P) ワークフローのトリガー条件を設定
  - `on.push.branches: ["main"]`でmainブランチへのpushをトリガー条件に設定
  - `on.workflow_dispatch`で手動トリガーを有効化
  - トリガー条件が正しく記述されていることをYAML構文で確認
  - _Requirements: 1_

- [x] 1.3 (P) パーミッション設定を定義
  - `permissions.contents: read`でリポジトリコンテンツの読み取り権限を付与
  - `permissions.pages: write`でGitHub Pagesへの書き込み権限を付与
  - `permissions.id-token: write`でGitHub Pages Artifact方式に必要なトークン権限を付与
  - concurrency設定で`group: "pages"`、`cancel-in-progress: false`を設定し、同時デプロイを防止
  - _Requirements: 6_

- [x] 2. Build Jobの実装
- [x] 2.1 Build Job定義とコードチェックアウト
  - `build`ジョブを定義し、`runs-on: ubuntu-latest`で実行環境を指定
  - `actions/checkout@v4`でリポジトリコードをチェックアウト
  - チェックアウトステップが正常に動作することを確認
  - _Requirements: 2_

- [x] 2.2 Node.js環境のセットアップ
  - `actions/setup-node@v4`でNode.js 20環境をセットアップ
  - `node-version: '20'`を指定
  - `cache: 'npm'`でnpmキャッシュを有効化(actions/setup-node組み込み機能)
  - Node.js環境が正しくセットアップされることを確認
  - _Requirements: 2, 7_

- [x] 2.3 依存関係のインストール
  - `npm ci`で決定的な依存関係インストールを実行
  - package-lock.jsonを使用して再現性のあるビルド環境を構築
  - インストール失敗時はワークフローが停止することを確認
  - _Requirements: 2, 7_

- [x] 2.4 テストの実行
  - `npm test`でVitestテストスイートを実行
  - テスト結果がワークフローログに出力されることを確認
  - テスト失敗時はワークフロー全体が停止し、後続ステップがスキップされることを確認
  - _Requirements: 3_

- [x] 2.5 Viteビルドの実行
  - `npm run build`でViteビルドを実行
  - dist/ディレクトリにビルド成果物(index.html、assets/)が生成されることを確認
  - ビルド失敗時はワークフローが停止しエラーメッセージが出力されることを確認
  - _Requirements: 2_

- [x] 2.6 GitHub Pages Artifactのアップロード
  - `actions/upload-pages-artifact@v3`でdist/ディレクトリをArtifactとしてアップロード
  - `path: ./dist`でアップロード対象を指定
  - Artifactが正常にアップロードされ、deploy jobで利用可能になることを確認
  - _Requirements: 4_

- [x] 3. Deploy Jobの実装
- [x] 3.1 Deploy Job定義とBuild Job依存関係の設定
  - `deploy`ジョブを定義し、`runs-on: ubuntu-latest`で実行環境を指定
  - `needs: build`でbuild jobの成功を前提条件に設定
  - build job失敗時はdeploy jobがスキップされることを確認
  - _Requirements: 4_

- [x] 3.2 GitHub Pages環境の設定
  - `environment.name: github-pages`でデプロイ先環境を指定
  - `environment.url: ${{ steps.deployment.outputs.page_url }}`でデプロイURLを環境URLとして設定
  - 環境設定が正しく記述されていることを確認
  - _Requirements: 4_

- [x] 3.3 GitHub Pagesへのデプロイ実行
  - `actions/deploy-pages@v4`でGitHub Pages Artifactをデプロイ
  - ステップIDを`deployment`として設定し、デプロイURL出力を参照可能にする
  - デプロイ完了後に`${{ steps.deployment.outputs.page_url }}`がワークフローログに出力されることを確認
  - GitHub Pages設定でSourceが"GitHub Actions"に設定されていることを確認
  - _Requirements: 4_

- [x] 4. ワークフロー全体の統合と動作検証
- [x] 4.1 ワークフロー設定ファイルをGitリポジトリにコミット
  - `.github/workflows/deploy.yml`をGitでバージョン管理に追加
  - コミットメッセージで変更内容を明確に記述
  - リモートリポジトリにpushしてワークフローを有効化
  - _Requirements: 5_

- [ ] 4.2 mainブランチへのpushでワークフローが自動トリガーされることを確認
  - テストコードやREADMEなどの軽微な変更をmainブランチにpush
  - GitHub Actions UIでワークフローが自動的に実行開始されることを確認
  - ワークフロー実行履歴でトリガーイベントが`push`として記録されることを確認
  - _Requirements: 1_

- [ ] 4.3 手動トリガーでワークフローを実行できることを確認
  - GitHub Actions UIから"Run workflow"ボタンでワークフローを手動トリガー
  - workflow_dispatchイベントでワークフローが起動することを確認
  - 手動トリガー時もビルド・デプロイが正常に完了することを確認
  - _Requirements: 1_

- [ ] 4.4 ビルド・テスト・デプロイの全ステップが正常に完了することを確認
  - 全ステップ(チェックアウト、セットアップ、インストール、テスト、ビルド、アップロード、デプロイ)が成功することを確認
  - 各ステップのログを確認し、エラーや警告がないことを検証
  - デプロイ完了後のGitHub Pages URLにアクセスし、期待通りのコンテンツが表示されることを確認
  - _Requirements: 1, 2, 3, 4_

- [ ] 4.5* キャッシュ動作を検証(オプション)
  - 初回実行後、2回目のワークフロー実行でキャッシュが利用されることを確認
  - ワークフローログで"Cache restored"または類似のメッセージを確認
  - キャッシュ利用により依存関係インストール時間が短縮されることを確認
  - _Requirements: 7_

- [ ] 4.6* エラーハンドリングを検証(オプション)
  - テストコードを意図的に失敗させ、ワークフローが停止することを確認
  - ビルドエラーを発生させ、デプロイがスキップされることを確認
  - エラーメッセージがワークフローログに適切に出力されることを確認
  - _Requirements: 2, 3_

## Requirements Coverage Matrix

| Requirement | Tasks |
|-------------|-------|
| 1 | 1.2, 4.2, 4.3, 4.4 |
| 2 | 2.1, 2.2, 2.3, 2.5, 4.4, 4.6 |
| 3 | 2.4, 4.4, 4.6 |
| 4 | 2.6, 3.1, 3.2, 3.3, 4.4 |
| 5 | 1.1, 4.1 |
| 6 | 1.3 |
| 7 | 2.2, 2.3, 4.5 |

## Implementation Notes

### Parallel Execution
`(P)`マークが付いたタスクは並列実行可能です:
- 1.1, 1.2, 1.3: ワークフロー設定ファイルの異なるセクションを独立して記述可能

### Sequential Dependencies
以下のタスクは順次実行が必要です:
- 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6: Build Jobの各ステップは依存関係あり
- 3.1 → 3.2 → 3.3: Deploy Jobの各ステップは依存関係あり
- 4.1 → 4.2, 4.3, 4.4: ワークフローファイルコミット後に検証可能

### Optional Tasks
- 4.5: キャッシュ動作検証は初回デプロイ成功後に任意で実施
- 4.6: エラーハンドリング検証は機能検証として任意で実施
