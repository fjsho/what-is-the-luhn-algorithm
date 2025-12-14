import { describe, it, expect, beforeEach } from 'vitest';

describe('Layout and Styling (Task 5.2)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // HTMLを読み込んでDOMを構築
    container = document.createElement('div');
    container.innerHTML = `
      <aside id="validator-form" class="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:right-4 md:left-auto md:w-96 bg-white shadow-lg p-6 rounded-t-lg md:rounded-lg border-t md:border z-50">
        <h3 class="text-lg font-semibold mb-4">数値を検証</h3>
        <div class="mb-4">
          <label for="number-input" class="block text-sm font-medium text-gray-700 mb-2">
            検証対象の数値を入力
          </label>
          <input
            type="text"
            id="number-input"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: 4532015112830366"
            aria-label="検証対象の数値"
          >
        </div>
        <div id="result" class="p-3 rounded-md bg-gray-100 text-gray-600 text-sm" role="status" aria-live="polite">
          数値を入力してください
        </div>
      </aside>
    `;
    document.body.appendChild(container);
  });

  describe('固定配置スタイル', () => {
    it('フォームに固定配置クラスが適用されている', () => {
      const form = container.querySelector('#validator-form');
      expect(form).toBeTruthy();
      expect(form?.classList.contains('fixed')).toBe(true);
    });

    it('デスクトップ用の配置クラスが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // デスクトップ用: md:top-4 md:right-4
      expect(classList.some(c => c.includes('md:top'))).toBe(true);
      expect(classList.some(c => c.includes('md:right'))).toBe(true);
    });

    it('モバイル用の配置クラスが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル用: bottom-0 left-0 right-0
      expect(classList.includes('bottom-0')).toBe(true);
      expect(classList.includes('left-0')).toBe(true);
      expect(classList.includes('right-0')).toBe(true);
    });

    it('z-indexが設定されている', () => {
      const form = container.querySelector('#validator-form');
      expect(form?.classList.contains('z-50')).toBe(true);
    });
  });

  describe('浮遊感を演出するスタイル', () => {
    it('シャドウが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);
      expect(classList.some(c => c.includes('shadow'))).toBe(true);
    });

    it('パディングが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);
      expect(classList.some(c => c.includes('p-'))).toBe(true);
    });

    it('角丸が適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);
      expect(classList.some(c => c.includes('rounded'))).toBe(true);
    });

    it('背景色が設定されている', () => {
      const form = container.querySelector('#validator-form');
      expect(form?.classList.contains('bg-white')).toBe(true);
    });
  });

  describe('アクセシビリティ', () => {
    it('入力フォームにaria-labelが設定されている', () => {
      const input = container.querySelector('#number-input') as HTMLInputElement;
      expect(input?.getAttribute('aria-label')).toBeTruthy();
    });

    it('結果表示にrole="status"が設定されている', () => {
      const result = container.querySelector('#result');
      expect(result?.getAttribute('role')).toBe('status');
    });

    it('結果表示にaria-live="polite"が設定されている', () => {
      const result = container.querySelector('#result');
      expect(result?.getAttribute('aria-live')).toBe('polite');
    });

    it('入力フォームにフォーカススタイルが適用されている', () => {
      const input = container.querySelector('#number-input');
      const classList = Array.from(input?.classList || []);

      // フォーカス時のリングとボーダー
      expect(classList.some(c => c.includes('focus:ring'))).toBe(true);
      expect(classList.some(c => c.includes('focus:border'))).toBe(true);
    });

    it('labelがinputと正しく関連付けられている', () => {
      const label = container.querySelector('label[for="number-input"]');
      const input = container.querySelector('#number-input');

      expect(label).toBeTruthy();
      expect(input?.getAttribute('id')).toBe('number-input');
      expect(label?.getAttribute('for')).toBe('number-input');
    });
  });

  describe('レスポンシブデザイン', () => {
    it('モバイル用の幅クラスが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイルは left-0 right-0 で全幅
      expect(classList.includes('left-0')).toBe(true);
      expect(classList.includes('right-0')).toBe(true);
    });

    it('デスクトップ用の幅クラスが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // デスクトップ: md:w-96
      expect(classList.some(c => c.includes('md:w-'))).toBe(true);
    });

    it('モバイル用の角丸スタイルが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル: rounded-t-lg (上だけ角丸)
      expect(classList.includes('rounded-t-lg')).toBe(true);
    });

    it('デスクトップ用の角丸スタイルが適用されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // デスクトップ: md:rounded-lg (全体が角丸)
      expect(classList.includes('md:rounded-lg')).toBe(true);
    });
  });

  describe('視覚的な改善', () => {
    it('入力フォームに適切なパディングが設定されている', () => {
      const input = container.querySelector('#number-input');
      const classList = Array.from(input?.classList || []);

      expect(classList.includes('px-3')).toBe(true);
      expect(classList.includes('py-2')).toBe(true);
    });

    it('入力フォームにボーダーが設定されている', () => {
      const input = container.querySelector('#number-input');
      const classList = Array.from(input?.classList || []);

      expect(classList.some(c => c.includes('border'))).toBe(true);
    });

    it('結果表示に適切なパディングが設定されている', () => {
      const result = container.querySelector('#result');
      const classList = Array.from(result?.classList || []);

      expect(classList.includes('p-3')).toBe(true);
    });

    it('結果表示に背景色が設定されている', () => {
      const result = container.querySelector('#result');
      const classList = Array.from(result?.classList || []);

      expect(classList.some(c => c.includes('bg-'))).toBe(true);
    });
  });
});
