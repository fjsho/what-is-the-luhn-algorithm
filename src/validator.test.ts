import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupValidator } from './validator';

describe('Validator UI Logic', () => {
  let inputElement: HTMLInputElement;
  let resultElement: HTMLElement;

  beforeEach(() => {
    // DOM要素のモックを作成
    inputElement = document.createElement('input');
    inputElement.type = 'text';

    resultElement = document.createElement('div');
  });

  describe('setupValidator', () => {
    it('入力要素にイベントリスナーを登録する', () => {
      const addEventListenerSpy = vi.spyOn(inputElement, 'addEventListener');

      setupValidator(inputElement, resultElement);

      expect(addEventListenerSpy).toHaveBeenCalledWith('input', expect.any(Function));
    });

    it('初期状態で結果要素に初期メッセージを表示する', () => {
      setupValidator(inputElement, resultElement);

      expect(resultElement.textContent).toBe('数値を入力してください');
    });
  });

  describe('入力バリデーション (Task 3.1)', () => {
    it('空文字の場合は適切なメッセージを表示する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toContain('数値を入力してください');
      expect(resultElement.className).toContain('bg-gray-100');
      expect(resultElement.className).toContain('text-gray-600');
    });

    it('数値のみの入力を受け入れる', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '4532015112830366';
      inputElement.dispatchEvent(new Event('input'));

      // 有効な数値なので「有効な数値です」が表示される
      expect(resultElement.textContent).toContain('有効');
    });

    it('非数値入力の場合はエラーメッセージを表示する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '1234abc';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('数値のみを入力してください');
      expect(resultElement.className).toContain('bg-red-100');
      expect(resultElement.className).toContain('text-red-700');
    });

    it('スペースを含む入力はエラーとする', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '1234 5678';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('数値のみを入力してください');
      expect(resultElement.className).toContain('bg-red-100');
    });

    it('記号を含む入力はエラーとする', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '1234-5678';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('数値のみを入力してください');
    });
  });

  describe('リアルタイム検証イベント処理 (Task 3.2)', () => {
    it('inputイベントが発火すると検証が実行される', () => {
      setupValidator(inputElement, resultElement);

      // 有効な数値を入力
      inputElement.value = '79927398713';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('有効な数値です');
    });

    it('連続した入力でもリアルタイムに検証が行われる', () => {
      setupValidator(inputElement, resultElement);

      // 1回目: 無効な数値
      inputElement.value = '1234';
      inputElement.dispatchEvent(new Event('input'));
      expect(resultElement.textContent).toContain('無効');

      // 2回目: 有効な数値
      inputElement.value = '79927398713';
      inputElement.dispatchEvent(new Event('input'));
      expect(resultElement.textContent).toContain('有効');

      // 3回目: エラー
      inputElement.value = 'abc';
      inputElement.dispatchEvent(new Event('input'));
      expect(resultElement.textContent).toContain('数値のみ');
    });

    it('入力が変更されるたびに検証結果が更新される', () => {
      setupValidator(inputElement, resultElement);

      const validNumber = '4532015112830366';
      const invalidNumber = '4532015112830367';

      inputElement.value = validNumber;
      inputElement.dispatchEvent(new Event('input'));
      expect(resultElement.textContent).toBe('有効な数値です');

      inputElement.value = invalidNumber;
      inputElement.dispatchEvent(new Event('input'));
      expect(resultElement.textContent).toBe('無効な数値です');
    });
  });

  describe('検証結果のUI更新 (Task 3.3)', () => {
    it('有効な数値の場合は成功スタイルを適用する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '79927398713';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('有効な数値です');
      expect(resultElement.className).toContain('bg-green-100');
      expect(resultElement.className).toContain('text-green-700');
    });

    it('無効な数値の場合はエラースタイルを適用する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '1234567890';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('無効な数値です');
      expect(resultElement.className).toContain('bg-red-100');
      expect(resultElement.className).toContain('text-red-700');
    });

    it('空文字の場合はニュートラルなスタイルを適用する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toContain('数値を入力してください');
      expect(resultElement.className).toContain('bg-gray-100');
      expect(resultElement.className).toContain('text-gray-600');
    });

    it('非数値入力の場合はエラースタイルを適用する', () => {
      setupValidator(inputElement, resultElement);

      inputElement.value = 'invalid';
      inputElement.dispatchEvent(new Event('input'));

      expect(resultElement.textContent).toBe('数値のみを入力してください');
      expect(resultElement.className).toContain('bg-red-100');
      expect(resultElement.className).toContain('text-red-700');
    });

    it('XSS対策としてtextContentを使用する', () => {
      setupValidator(inputElement, resultElement);

      // 悪意のあるスクリプトを含む入力
      inputElement.value = '<script>alert("xss")</script>';
      inputElement.dispatchEvent(new Event('input'));

      // textContentで設定されているため、HTMLタグはエスケープされる
      expect(resultElement.innerHTML).not.toContain('<script>');
      expect(resultElement.textContent).toBe('数値のみを入力してください');
    });
  });
});
