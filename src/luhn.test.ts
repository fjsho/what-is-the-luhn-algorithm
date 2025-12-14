import { describe, it, expect } from 'vitest';
import { validateLuhn, calculateChecksum } from './luhn';

describe('Luhn Algorithm', () => {
  describe('validateLuhn', () => {
    it('有効なクレジットカード番号を検証できる', () => {
      // 有効なテスト用クレジットカード番号
      const result = validateLuhn('4532015112830366');
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('有効');
    });

    it('無効なクレジットカード番号を検証できる', () => {
      const result = validateLuhn('4532015112830367');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('無効');
    });

    it('有効な短い数値を検証できる', () => {
      const result = validateLuhn('79927398713');
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('有効');
    });

    it('無効な短い数値を検証できる', () => {
      const result = validateLuhn('79927398714');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('無効');
    });

    it('1桁の数値を正しく処理できる', () => {
      const result = validateLuhn('0');
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('有効');
    });

    it('空文字列を処理できる', () => {
      const result = validateLuhn('');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('空');
    });

    it('数値以外の文字を含む入力を拒否する', () => {
      const result = validateLuhn('1234abc');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('数値');
    });

    it('スペースを含む入力を拒否する', () => {
      const result = validateLuhn('1234 5678');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('数値');
    });
  });

  describe('calculateChecksum', () => {
    it('既知のチェックサム値を正しく計算できる', () => {
      // 4532015112830366 の場合
      const digits = [4, 5, 3, 2, 0, 1, 5, 1, 1, 2, 8, 3, 0, 3, 6, 6];
      const checksum = calculateChecksum(digits);
      expect(checksum % 10).toBe(0); // Luhnアルゴリズムでは合計が10で割り切れる
    });

    it('無効な数値のチェックサムを計算できる', () => {
      // 4532015112830367 の場合(無効)
      const digits = [4, 5, 3, 2, 0, 1, 5, 1, 1, 2, 8, 3, 0, 3, 6, 7];
      const checksum = calculateChecksum(digits);
      expect(checksum % 10).not.toBe(0); // 10で割り切れない
    });

    it('1桁の数値のチェックサムを計算できる', () => {
      const digits = [0];
      const checksum = calculateChecksum(digits);
      expect(checksum).toBe(0);
    });

    it('空の配列のチェックサムを計算できる', () => {
      const digits: number[] = [];
      const checksum = calculateChecksum(digits);
      expect(checksum).toBe(0);
    });
  });
});
