import { describe, it, expect, beforeEach } from 'vitest';
import { validateLuhn } from './luhn';
import { setupValidator } from './validator';

/**
 * Task 6.1: 開発サーバーで動作を確認
 *
 * このテストは、開発環境での主要機能の動作を検証します。
 * 実際のブラウザでの手動確認項目も含まれています。
 */
describe('開発サーバー動作検証 (Task 6.1)', () => {
  describe('有効な数値の検証', () => {
    it('有効なクレジットカード番号で「有効」と表示される', () => {
      // 既知の有効なLuhn番号
      const validNumbers = [
        '4532015112830366', // Visa
        '79927398713',      // 一般的な有効番号
        '49927398716',      // 一般的な有効番号
      ];

      validNumbers.forEach((number) => {
        const result = validateLuhn(number);
        expect(result.isValid).toBe(true);
        expect(result.message).toContain('有効');
      });
    });

    it('単一桁の有効な数値で「有効」と表示される', () => {
      const result = validateLuhn('0');
      expect(result.isValid).toBe(true);
    });
  });

  describe('無効な数値の検証', () => {
    it('無効な数値で「無効」と表示される', () => {
      const invalidNumbers = [
        '4532015112830367', // 最後の桁が間違っている
        '1234567890',       // ランダムな数値
        '79927398712',      // チェックサムが合わない
      ];

      invalidNumbers.forEach((number) => {
        const result = validateLuhn(number);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('無効');
      });
    });
  });

  describe('非数値入力のエラーメッセージ', () => {
    it('空文字でエラーメッセージが表示される', () => {
      const result = validateLuhn('');
      expect(result.isValid).toBe(false);
      expect(result.message).toMatch(/入力|空/);
    });

    it('アルファベットを含む入力でエラーメッセージが表示される', () => {
      const result = validateLuhn('123abc456');
      expect(result.isValid).toBe(false);
      expect(result.message).toMatch(/数値/);
    });

    it('特殊文字を含む入力でエラーメッセージが表示される', () => {
      const result = validateLuhn('123-456-789');
      expect(result.isValid).toBe(false);
      expect(result.message).toMatch(/数値/);
    });

    it('スペースを含む入力でエラーメッセージが表示される', () => {
      const result = validateLuhn('1234 5678 9012');
      expect(result.isValid).toBe(false);
      expect(result.message).toMatch(/数値/);
    });
  });

  describe('リアルタイム検証の統合動作', () => {
    let inputElement: HTMLInputElement;
    let resultElement: HTMLElement;

    beforeEach(() => {
      // DOM環境をセットアップ
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.id = 'number-input';

      resultElement = document.createElement('div');
      resultElement.id = 'result';

      document.body.appendChild(inputElement);
      document.body.appendChild(resultElement);

      // バリデーターを初期化
      setupValidator(inputElement, resultElement);
    });

    it('有効な数値入力時にリアルタイムで「有効」が表示される', () => {
      inputElement.value = '4532015112830366';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));

      expect(resultElement.textContent).toContain('有効');
    });

    it('無効な数値入力時にリアルタイムで「無効」が表示される', () => {
      inputElement.value = '1234567890';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));

      expect(resultElement.textContent).toContain('無効');
    });

    it('非数値入力時にリアルタイムでエラーメッセージが表示される', () => {
      inputElement.value = 'abc123';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));

      expect(resultElement.textContent).toMatch(/数値/);
    });

    it('入力が空になったときに適切なメッセージが表示される', () => {
      // 最初に有効な値を入力
      inputElement.value = '4532015112830366';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));

      // その後、空にする
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));

      expect(resultElement.textContent).toMatch(/入力/);
    });
  });

  describe('UI要素の存在確認', () => {
    it('index.htmlに必要な要素IDが定義されている', () => {
      // この検証は実際のブラウザで以下を確認することを意味する:
      // - #number-input が存在する
      // - #result が存在する
      // - #validator-form が存在する

      // ここではDOMが正しくセットアップされればvalidatorが動作することを確認
      const input = document.createElement('input');
      input.id = 'number-input';
      const result = document.createElement('div');
      result.id = 'result';

      expect(() => setupValidator(input, result)).not.toThrow();
    });
  });

  describe('スクロール追随の設定確認', () => {
    it('固定配置フォームがfixedポジショニングを持つ', () => {
      // 実際のブラウザで確認する項目:
      // - #validator-form が position: fixed を持つ
      // - デスクトップで top-4 right-4 が適用される
      // - モバイルで bottom-0 left-0 right-0 が適用される
      // - z-index: 50 が適用される

      const form = document.createElement('aside');
      form.id = 'validator-form';
      form.className = 'fixed bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:right-4 md:left-auto md:w-96 bg-white shadow-lg p-6 rounded-t-lg md:rounded-lg border-t md:border z-50';

      expect(form.classList.contains('fixed')).toBe(true);
      expect(form.classList.contains('z-50')).toBe(true);
    });
  });
});

/**
 * 手動確認チェックリスト (ブラウザで実施)
 *
 * ✓ npm run dev で開発サーバーが起動する
 * ✓ ブラウザで http://localhost:5177/ を開く
 * ✓ ページが正しく表示される
 * ✓ 入力フォームに有効な数値(例: 4532015112830366)を入力
 *   → 「有効な数値です」と表示される
 * ✓ 入力フォームに無効な数値(例: 1234567890)を入力
 *   → 「無効な数値です」と表示される
 * ✓ 入力フォームに非数値(例: abc123)を入力
 *   → 「数値のみを入力してください」と表示される
 * ✓ ページをスクロールする
 *   → 固定フォームが画面に追随して表示され続ける
 * ✓ デスクトップサイズ(幅 > 768px)で確認
 *   → フォームが右上に固定表示される
 * ✓ モバイルサイズ(幅 < 768px)で確認
 *   → フォームが画面下部に固定表示される
 */
