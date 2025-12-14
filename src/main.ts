import { setupValidator } from './validator';

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
  // DOM要素を取得
  const inputElement = document.getElementById('number-input') as HTMLInputElement;
  const resultElement = document.getElementById('result') as HTMLElement;

  // DOM要素が存在することを確認
  if (!inputElement || !resultElement) {
    console.error('必要なDOM要素が見つかりません');
    return;
  }

  // バリデーターを初期化
  setupValidator(inputElement, resultElement);

  console.log('Luhn Algorithm Validator - Initialized successfully');
});
