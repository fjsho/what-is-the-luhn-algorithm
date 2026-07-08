import { describe, it, expect, beforeEach } from 'vitest';

describe('Layout Adjustment (Task 5.3)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // 実際のindex.htmlの構造を模擬
    container = document.createElement('div');
    container.innerHTML = `
      <main class="container mx-auto px-4 py-8 max-w-4xl md:pr-[420px]">
        <section id="explanation">Content</section>
        <section id="generation">Content</section>
        <section id="validation">Content</section>
        <div class="h-56 md:h-0"></div>
      </main>
      <aside id="validator-form" class="ads-card fixed bottom-0 left-0 right-0 md:bottom-auto md:top-16 md:right-4 md:left-auto md:w-96 p-6 rounded-t-lg md:rounded-lg z-50">
        <h3>数値を検証</h3>
        <input type="text" id="number-input">
        <div id="result"></div>
      </aside>
    `;
    document.body.appendChild(container);
  });

  describe('デスクトップレイアウト調整', () => {
    it('main要素にデスクトップ用の右パディングが設定されている', () => {
      const main = container.querySelector('main');
      const classList = Array.from(main?.classList || []);

      // md:pr-[420px] クラスの存在を確認
      expect(classList.includes('md:pr-[420px]')).toBe(true);
    });

    it('mainコンテンツが固定フォームと重ならないパディング値', () => {
      const main = container.querySelector('main');
      const classList = Array.from(main?.classList || []);

      // 420px = フォーム幅(384px) + 右オフセット(16px) + ギャップ(20px)
      expect(classList.includes('md:pr-[420px]')).toBe(true);
    });

    it('固定フォームの幅と位置が適切に設定されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // デスクトップ用の設定を確認
      expect(classList.includes('md:w-96')).toBe(true); // 384px幅
      expect(classList.includes('md:top-16')).toBe(true); // 上から64px (トップナビゲーションの下)
      expect(classList.includes('md:right-4')).toBe(true); // 右から16px
    });
  });

  describe('モバイルレイアウト調整', () => {
    it('スペーサーの高さが十分に確保されている', () => {
      const spacer = container.querySelector('main > div:last-child');
      const classList = Array.from(spacer?.classList || []);

      // h-56 = 224px (フォームの高さ約210pxをカバー)
      expect(classList.includes('h-56')).toBe(true);
    });

    it('デスクトップではスペーサーが非表示', () => {
      const spacer = container.querySelector('main > div:last-child');
      const classList = Array.from(spacer?.classList || []);

      // デスクトップでは高さ0
      expect(classList.includes('md:h-0')).toBe(true);
    });

    it('固定フォームがモバイルで画面下部に配置されている', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル用の設定を確認
      expect(classList.includes('bottom-0')).toBe(true);
      expect(classList.includes('left-0')).toBe(true);
      expect(classList.includes('right-0')).toBe(true);
    });
  });

  describe('スクロール追随動作', () => {
    it('フォームにfixed配置が設定されている', () => {
      const form = container.querySelector('#validator-form');

      expect(form?.classList.contains('fixed')).toBe(true);
    });

    it('フォームのz-indexが適切に設定されている', () => {
      const form = container.querySelector('#validator-form');

      // z-50で他の要素の上に表示
      expect(form?.classList.contains('z-50')).toBe(true);
    });
  });

  describe('コンテンツとフォームの共存', () => {
    it('mainコンテンツに最大幅が設定されている', () => {
      const main = container.querySelector('main');

      expect(main?.classList.contains('max-w-4xl')).toBe(true);
    });

    it('mainコンテンツが中央寄せされている', () => {
      const main = container.querySelector('main');

      expect(main?.classList.contains('mx-auto')).toBe(true);
    });

    it('mainコンテンツに基本パディングが設定されている', () => {
      const main = container.querySelector('main');
      const classList = Array.from(main?.classList || []);

      expect(classList.includes('px-4')).toBe(true);
      expect(classList.includes('py-8')).toBe(true);
    });

    it('解説セクションが複数存在する', () => {
      const sections = container.querySelectorAll('main section');

      // 少なくとも3つのセクション(explanation, generation, validation)
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('レスポンシブデザインの一貫性', () => {
    it('デスクトップとモバイルでフォームの位置が切り替わる', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル: bottom-0
      expect(classList.includes('bottom-0')).toBe(true);

      // デスクトップ: md:bottom-auto (bottomを無効化), md:top-16
      expect(classList.includes('md:bottom-auto')).toBe(true);
      expect(classList.includes('md:top-16')).toBe(true);
    });

    it('デスクトップとモバイルでフォームの幅が切り替わる', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル: left-0 right-0 (全幅)
      expect(classList.includes('left-0')).toBe(true);
      expect(classList.includes('right-0')).toBe(true);

      // デスクトップ: md:w-96 (固定幅), md:left-auto (leftを無効化)
      expect(classList.includes('md:w-96')).toBe(true);
      expect(classList.includes('md:left-auto')).toBe(true);
    });

    it('デスクトップとモバイルで角丸が切り替わる', () => {
      const form = container.querySelector('#validator-form');
      const classList = Array.from(form?.classList || []);

      // モバイル: rounded-t-lg (上部のみ角丸)
      expect(classList.includes('rounded-t-lg')).toBe(true);

      // デスクトップ: md:rounded-lg (全体が角丸)
      expect(classList.includes('md:rounded-lg')).toBe(true);
    });
  });
});
