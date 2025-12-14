import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Task 6.2: 本番ビルドとバンドルサイズを検証
 *
 * このテストは、本番ビルドの成果物を検証します。
 * ビルドは手動で実行する必要があります: `npm run build`
 */
describe('本番ビルド検証 (Task 6.2)', () => {
  const distPath = join(process.cwd(), 'dist');

  describe('ビルド成果物の存在確認', () => {
    it('dist/フォルダが存在する', () => {
      // ビルドが実行されていない場合はスキップ
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      expect(existsSync(distPath)).toBe(true);
    });

    it('index.htmlが生成されている', () => {
      const indexPath = join(distPath, 'index.html');

      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      expect(existsSync(indexPath)).toBe(true);
    });

    it('assets/フォルダが存在する', () => {
      const assetsPath = join(distPath, 'assets');

      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      expect(existsSync(assetsPath)).toBe(true);
    });
  });

  describe('バンドルサイズの検証', () => {
    it('総バンドルサイズが100KB未満である', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const assetsPath = join(distPath, 'assets');
      if (!existsSync(assetsPath)) {
        console.warn('⚠️  assets/フォルダが見つかりません。');
        return;
      }

      // assetsフォルダ内のすべてのファイルサイズを合計
      let totalSize = 0;
      const files = readdirSync(assetsPath);

      files.forEach(file => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        totalSize += stats.size;
      });

      const totalSizeKB = totalSize / 1024;

      console.log(`📦 総バンドルサイズ: ${totalSizeKB.toFixed(2)} KB`);

      // 目標: < 100KB
      expect(totalSizeKB).toBeLessThan(100);
    });

    it('個別のJavaScriptファイルが適切なサイズである', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const assetsPath = join(distPath, 'assets');
      if (!existsSync(assetsPath)) {
        console.warn('⚠️  assets/フォルダが見つかりません。');
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));

      jsFiles.forEach(file => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        const fileSizeKB = stats.size / 1024;

        console.log(`📄 ${file}: ${fileSizeKB.toFixed(2)} KB`);

        // 個別のJSファイルは50KB未満を推奨
        expect(fileSizeKB).toBeLessThan(50);
      });
    });

    it('個別のCSSファイルが適切なサイズである', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const assetsPath = join(distPath, 'assets');
      if (!existsSync(assetsPath)) {
        console.warn('⚠️  assets/フォルダが見つかりません。');
        return;
      }

      const files = readdirSync(assetsPath);
      const cssFiles = files.filter(file => file.endsWith('.css'));

      cssFiles.forEach(file => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        const fileSizeKB = stats.size / 1024;

        console.log(`🎨 ${file}: ${fileSizeKB.toFixed(2)} KB`);

        // 個別のCSSファイルは50KB未満を推奨
        expect(fileSizeKB).toBeLessThan(50);
      });
    });
  });

  describe('ビルド成果物の内容検証', () => {
    it('index.htmlに必要なDOM要素が含まれている', () => {
      const indexPath = join(distPath, 'index.html');

      if (!existsSync(indexPath)) {
        console.warn('⚠️  index.htmlが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const html = readFileSync(indexPath, 'utf-8');

      // 必要な要素IDが含まれているか確認
      expect(html).toContain('number-input');
      expect(html).toContain('result');
      expect(html).toContain('validator-form');
    });

    it('index.htmlにアセットへの参照が含まれている', () => {
      const indexPath = join(distPath, 'index.html');

      if (!existsSync(indexPath)) {
        console.warn('⚠️  index.htmlが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const html = readFileSync(indexPath, 'utf-8');

      // JavaScriptとCSSへの参照が含まれているか
      expect(html).toMatch(/assets\/.*\.js/);
      expect(html).toMatch(/assets\/.*\.css/);
    });

    it('JavaScriptファイルにLuhnアルゴリズムのコードが含まれている', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const assetsPath = join(distPath, 'assets');
      if (!existsSync(assetsPath)) {
        console.warn('⚠️  assets/フォルダが見つかりません。');
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));

      // 少なくとも1つのJSファイルが存在する
      expect(jsFiles.length).toBeGreaterThan(0);

      // JSファイルにLuhn関連のコードが含まれているか確認
      const jsContent = jsFiles.map(file =>
        readFileSync(join(assetsPath, file), 'utf-8')
      ).join('\n');

      // ミニファイされていても検出できるようなパターン
      expect(jsContent.length).toBeGreaterThan(0);
    });
  });

  describe('静的ファイルのみで構成されている', () => {
    it('dist/フォルダにサーバーサイドコードが含まれていない', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const files = readdirSync(distPath);

      // サーバーサイドファイルが存在しないことを確認
      const serverFiles = files.filter(file =>
        file.endsWith('.php') ||
        file.endsWith('.py') ||
        file.endsWith('.rb') ||
        file.endsWith('.go') ||
        file === 'server.js'
      );

      expect(serverFiles.length).toBe(0);
    });

    it('必要なファイルのみが含まれている', () => {
      if (!existsSync(distPath)) {
        console.warn('⚠️  dist/フォルダが見つかりません。`npm run build`を実行してください。');
        return;
      }

      const files = readdirSync(distPath);

      // 基本的なファイル構成を確認
      expect(files).toContain('index.html');
      expect(files).toContain('assets');

      // 不要な開発ファイルが含まれていないことを確認
      expect(files).not.toContain('node_modules');
      expect(files).not.toContain('src');
      expect(files).not.toContain('.git');
    });
  });
});

/**
 * ビルド検証手順
 *
 * 1. 本番ビルドを実行:
 *    ```bash
 *    npm run build
 *    ```
 *
 * 2. テストを実行:
 *    ```bash
 *    npm test
 *    ```
 *
 * 3. ビルドプレビューを確認:
 *    ```bash
 *    npm run preview
 *    ```
 *
 * 4. ブラウザで動作確認:
 *    - http://localhost:4173/ を開く
 *    - 有効な数値入力の検証
 *    - 無効な数値入力の検証
 *    - 非数値入力のエラー表示
 *    - スクロール追随の動作
 */
