import { validateLuhn } from './luhn';

/**
 * バリデーターサービスのインターフェース
 */
export interface ValidatorService {
  /**
   * バリデーターを初期化し、イベントリスナーを設定
   * @param inputElement - 入力フォーム要素
   * @param resultElement - 結果表示要素
   */
  setupValidator(inputElement: HTMLInputElement, resultElement: HTMLElement): void;
}

/**
 * バリデーターを初期化し、イベントリスナーを設定
 * @param inputElement - 入力フォーム要素
 * @param resultElement - 結果表示要素
 */
export function setupValidator(
  inputElement: HTMLInputElement,
  resultElement: HTMLElement
): void {
  // 初期メッセージを表示
  updateUI(resultElement, '数値を入力してください', 'neutral');

  // inputイベントリスナーを登録
  inputElement.addEventListener('input', () => {
    const value = inputElement.value;
    handleInput(value, resultElement);
  });
}

/**
 * 入力値をバリデーションして結果を表示
 * @param value - 入力値
 * @param resultElement - 結果表示要素
 */
function handleInput(value: string, resultElement: HTMLElement): void {
  // 空文字チェック
  if (value === '') {
    updateUI(resultElement, '数値を入力してください', 'neutral');
    return;
  }

  // 数値チェック (正規表現で数値のみを許可)
  if (!/^\d+$/.test(value)) {
    updateUI(resultElement, '数値のみを入力してください', 'error');
    return;
  }

  // Luhn検証を実行
  const result = validateLuhn(value);

  // 検証結果に基づいてUIを更新
  if (result.isValid) {
    updateUI(resultElement, result.message, 'success');
  } else {
    updateUI(resultElement, result.message, 'error');
  }
}

/**
 * 検証結果のUI更新
 * @param element - 結果表示要素
 * @param message - 表示メッセージ
 * @param type - メッセージタイプ (success | error | neutral)
 */
function updateUI(
  element: HTMLElement,
  message: string,
  type: 'success' | 'error' | 'neutral'
): void {
  // XSS対策: textContentを使用してHTMLタグをエスケープ
  element.textContent = message;

  // 既存のスタイルクラスをクリア (Atlassian Design System トークンベースのスタイル)
  element.className = 'ads-result';

  // メッセージタイプに応じたスタイルを適用
  switch (type) {
    case 'success':
      element.className += ' ads-result--success';
      break;
    case 'error':
      element.className += ' ads-result--error';
      break;
    case 'neutral':
      element.className += ' ads-result--neutral';
      break;
  }
}
