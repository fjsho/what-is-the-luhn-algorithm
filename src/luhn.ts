/**
 * Luhn アルゴリズムの検証結果を表す型
 */
export type ValidationResult = {
  isValid: boolean;
  message: string;
};

/**
 * Luhn アルゴリズムサービスのインターフェース
 */
export interface LuhnService {
  /**
   * Luhnアルゴリズムで数値文字列を検証
   * @param input - 検証対象の数値文字列
   * @returns 検証結果オブジェクト
   */
  validateLuhn(input: string): ValidationResult;

  /**
   * 数値配列のLuhnチェックサム計算
   * @param digits - 数値配列
   * @returns チェックサム値
   */
  calculateChecksum(digits: number[]): number;
}

/**
 * 数値配列のLuhnチェックサムを計算
 * @param digits - 数値配列
 * @returns チェックサム値
 */
export function calculateChecksum(digits: number[]): number {
  if (digits.length === 0) {
    return 0;
  }

  let sum = 0;
  let shouldDouble = false;

  // 右から左に処理
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (shouldDouble) {
      digit *= 2;
      // 2倍した結果が10以上の場合は各桁を合計
      if (digit > 9) {
        digit = digit - 9; // 10以上の場合は9を引くことで各桁の合計と同じ
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum;
}

/**
 * Luhnアルゴリズムで数値文字列を検証
 * @param input - 検証対象の数値文字列
 * @returns 検証結果オブジェクト
 */
export function validateLuhn(input: string): ValidationResult {
  // 空文字列チェック
  if (input === '') {
    return {
      isValid: false,
      message: '数値を入力してください(入力値が空です)'
    };
  }

  // 数値チェック
  if (!/^\d+$/.test(input)) {
    return {
      isValid: false,
      message: '数値のみを入力してください'
    };
  }

  // 文字列を数値配列に変換
  const digits = input.split('').map(char => parseInt(char, 10));

  // チェックサム計算
  const checksum = calculateChecksum(digits);

  // 10で割り切れるかチェック
  const isValid = checksum % 10 === 0;

  return {
    isValid,
    message: isValid ? '有効な数値です' : '無効な数値です'
  };
}
