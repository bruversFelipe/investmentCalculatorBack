/**
 * Tests for Investment Simulation Calculator - Calculation Services
 */

import {
  calculateIR,
  calculateIOF,
  normalRandom,
  calculateFixedIncome,
  calculateVariableIncome,
  calculateComparison
} from '../../src/services/calculations.js';

describe('calculateIR', () => {
  test('should apply 22.5% for periods up to 180 days', () => {
    const ir = calculateIR(1000, 6); // 6 months = 180 days
    expect(ir).toBe(225);
  });

  test('should apply 20% for periods 181-360 days', () => {
    const ir = calculateIR(1000, 7); // 7 months = 210 days
    expect(ir).toBe(200);
    
    const ir12 = calculateIR(1000, 12); // 12 months = 360 days
    expect(ir12).toBe(200);
  });

  test('should apply 17.5% for periods 361-720 days', () => {
    const ir = calculateIR(1000, 13); // 13 months = 390 days
    expect(ir).toBe(175);
    
    const ir24 = calculateIR(1000, 24); // 24 months = 720 days
    expect(ir24).toBe(175);
  });

  test('should apply 15% for periods above 720 days', () => {
    const ir = calculateIR(1000, 25); // 25 months = 750 days
    expect(ir).toBe(150);
    
    const ir36 = calculateIR(1000, 36); // 36 months
    expect(ir36).toBe(150);
  });

  test('should handle zero profit', () => {
    const ir = calculateIR(0, 12);
    expect(ir).toBe(0);
  });

  test('should handle negative profit (edge case)', () => {
    const ir = calculateIR(-1000, 12);
    expect(ir).toBe(-200); // 20% of -1000
  });
});

describe('calculateIOF', () => {
  test('should return 0 for periods >= 30 days', () => {
    const iof = calculateIOF(1000, 1); // 1 month = 30 days
    expect(iof).toBe(0);
    
    const iof2 = calculateIOF(1000, 2); // 2 months
    expect(iof2).toBe(0);
    
    const iof12 = calculateIOF(1000, 12); // 12 months
    expect(iof12).toBe(0);
  });

  test('should apply 96% for 1 day period', () => {
    // 1 day = 1/30 month (approximately)
    // For testing, we need to pass a fraction that represents < 1 month
    // The function uses periodMonths * 30 to get days
    // So for 1 day: periodMonths = 1/30
    const periodMonths = 1 / 30;
    const iof = calculateIOF(1000, periodMonths);
    expect(iof).toBe(960);
  });

  test('should apply regressive rate for 2-29 days', () => {
    // 2 days: rate = (96 - 3*(2-1))/100 = 93/100 = 0.93
    const iof2Days = calculateIOF(1000, 2/30);
    expect(iof2Days).toBe(930);
    
    // 10 days: rate = (96 - 3*(10-1))/100 = 69/100 = 0.69
    const iof10Days = calculateIOF(1000, 10/30);
    expect(iof10Days).toBe(690);
    
    // 29 days: rate = (96 - 3*(29-1))/100 = 12/100 = 0.12
    const iof29Days = calculateIOF(1000, 29/30);
    expect(iof29Days).toBe(120);
  });

  test('should have decreasing IOF as days increase', () => {
    const iof5Days = calculateIOF(1000, 5/30);
    const iof15Days = calculateIOF(1000, 15/30);
    const iof25Days = calculateIOF(1000, 25/30);
    
    expect(iof5Days).toBeGreaterThan(iof15Days);
    expect(iof15Days).toBeGreaterThan(iof25Days);
  });

  test('should handle zero profit', () => {
    const iof = calculateIOF(0, 0.5);
    expect(iof).toBe(0);
  });
});

describe('normalRandom', () => {
  test('should return a number', () => {
    const result = normalRandom(0, 1);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  test('should generate values around the mean', () => {
    const mean = 10;
    const stdDev = 2;
    const samples = 1000;
    let sum = 0;
    
    for (let i = 0; i < samples; i++) {
      sum += normalRandom(mean, stdDev);
    }
    
    const average = sum / samples;
    // Average should be close to mean (within 1 stdDev for large sample)
    expect(average).toBeGreaterThan(mean - 1);
    expect(average).toBeLessThan(mean + 1);
  });

  test('should handle zero standard deviation', () => {
    const result = normalRandom(5, 0);
    expect(result).toBe(5);
  });

  test('should handle negative mean', () => {
    const result = normalRandom(-5, 1);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });
});

describe('calculateFixedIncome', () => {
  test('should calculate fixed income with no monthly contributions', () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      annualRate: 12
    });

    expect(result.totalInvested).toBe(10000);
    expect(result.finalAmount).toBeGreaterThan(10000);
    expect(result.grossProfit).toBeGreaterThan(0);
    expect(result.monthlyEvolution).toHaveLength(13); // 0 + 12 months
    expect(result.monthlyEvolution[0]).toEqual({ month: 0, value: 10000 });
  });

  test('should calculate fixed income with monthly contributions', () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 500,
      periodMonths: 12,
      annualRate: 12
    });

    expect(result.totalInvested).toBe(16000); // 10000 + (500 * 12)
    expect(result.finalAmount).toBeGreaterThan(16000);
    expect(result.grossProfit).toBeGreaterThan(0);
    expect(result.netProfit).toBeLessThan(result.grossProfit); // After taxes
    expect(result.monthlyEvolution).toHaveLength(13);
  });

  test('should apply compound interest correctly', () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 0,
      periodMonths: 1,
      annualRate: 12
    });

    // Monthly rate = 12% / 12 = 1%
    // Expected: 1000 * 1.01 = 1010
    expect(result.finalAmount).toBeCloseTo(1010, 2);
    expect(result.grossProfit).toBeCloseTo(10, 2);
  });

  test('should calculate IR tax correctly for 12 month period', () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      annualRate: 12
    });

    // 12 months = 360 days, IR rate should be 20%
    const expectedIR = result.grossProfit * 0.20;
    expect(result.ir).toBeCloseTo(expectedIR, 2);
  });

  test('should not apply IOF for periods >= 30 days', () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 1,
      annualRate: 12
    });

    // 1 month = 30 days, IOF should be 0
    expect(result.iof).toBe(0);
  });

  test('should calculate net profit after taxes', () => {
    const result = calculateFixedIncome({
      initialAmount: 10000,
      monthlyContribution: 500,
      periodMonths: 12,
      annualRate: 12
    });

    const expectedNetProfit = result.grossProfit - result.ir - result.iof;
    expect(result.netProfit).toBeCloseTo(expectedNetProfit, 2);
  });

  test('should track monthly evolution correctly', () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      annualRate: 12
    });

    expect(result.monthlyEvolution).toHaveLength(4); // 0 + 3 months
    expect(result.monthlyEvolution[0].month).toBe(0);
    expect(result.monthlyEvolution[0].value).toBe(1000);
    
    // Each month should have increasing value
    for (let i = 1; i < result.monthlyEvolution.length; i++) {
      expect(result.monthlyEvolution[i].value).toBeGreaterThan(
        result.monthlyEvolution[i - 1].value
      );
    }
  });

  test('should return all required fields', () => {
    const result = calculateFixedIncome({
      initialAmount: 5000,
      monthlyContribution: 200,
      periodMonths: 6,
      annualRate: 10
    });

    expect(result).toHaveProperty('finalAmount');
    expect(result).toHaveProperty('totalInvested');
    expect(result).toHaveProperty('grossProfit');
    expect(result).toHaveProperty('netProfit');
    expect(result).toHaveProperty('ir');
    expect(result).toHaveProperty('iof');
    expect(result).toHaveProperty('monthlyEvolution');
    expect(Array.isArray(result.monthlyEvolution)).toBe(true);
  });

  test('should handle zero annual rate', () => {
    const result = calculateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      annualRate: 0
    });

    // With 0% rate, final amount should be just the sum of contributions
    expect(result.finalAmount).toBe(1300); // 1000 + 100*3
    expect(result.grossProfit).toBe(0);
    expect(result.ir).toBe(0);
    expect(result.netProfit).toBe(0);
  });
});

describe('calculateVariableIncome', () => {
  test('should calculate variable income with no monthly contributions', () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 0,
      periodMonths: 12,
      annualReturn: 15,
      volatility: 20
    });

    expect(result.totalInvested).toBe(10000);
    expect(result.finalAmount).toBeGreaterThan(0); // Can be positive or negative due to volatility
    expect(result.monthlyEvolution).toHaveLength(13); // 0 + 12 months
    expect(result.monthlyEvolution[0]).toEqual({ month: 0, value: 10000 });
  });

  test('should calculate variable income with monthly contributions', () => {
    const result = calculateVariableIncome({
      initialAmount: 10000,
      monthlyContribution: 500,
      periodMonths: 12,
      annualReturn: 15,
      volatility: 20
    });

    expect(result.totalInvested).toBe(16000); // 10000 + (500 * 12)
    expect(result.finalAmount).toBeGreaterThan(0);
    expect(result.monthlyEvolution).toHaveLength(13);
  });

  test('should return all required fields', () => {
    const result = calculateVariableIncome({
      initialAmount: 5000,
      monthlyContribution: 200,
      periodMonths: 6,
      annualReturn: 12,
      volatility: 15
    });

    expect(result).toHaveProperty('finalAmount');
    expect(result).toHaveProperty('totalInvested');
    expect(result).toHaveProperty('grossProfit');
    expect(result).toHaveProperty('monthlyEvolution');
    expect(Array.isArray(result.monthlyEvolution)).toBe(true);
  });

  test('should track monthly evolution correctly', () => {
    const result = calculateVariableIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      annualReturn: 12,
      volatility: 10
    });

    expect(result.monthlyEvolution).toHaveLength(4); // 0 + 3 months
    expect(result.monthlyEvolution[0].month).toBe(0);
    expect(result.monthlyEvolution[0].value).toBe(1000);
    
    // Each month should have a value (can increase or decrease due to volatility)
    for (let i = 1; i < result.monthlyEvolution.length; i++) {
      expect(result.monthlyEvolution[i].month).toBe(i);
      expect(typeof result.monthlyEvolution[i].value).toBe('number');
    }
  });

  test('should handle zero volatility (deterministic)', () => {
    const result = calculateVariableIncome({
      initialAmount: 1000,
      monthlyContribution: 0,
      periodMonths: 1,
      annualReturn: 12,
      volatility: 0
    });

    // With 0 volatility, should behave like fixed income
    // Monthly return = 12% / 12 = 1%
    expect(result.finalAmount).toBeCloseTo(1010, 0);
  });

  test('should produce different results with volatility (stochastic)', () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const result = calculateVariableIncome({
        initialAmount: 10000,
        monthlyContribution: 0,
        periodMonths: 12,
        annualReturn: 15,
        volatility: 30
      });
      results.push(result.finalAmount);
    }

    // With high volatility, results should vary
    const uniqueResults = new Set(results);
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  test('should handle zero annual return', () => {
    const result = calculateVariableIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      periodMonths: 3,
      annualReturn: 0,
      volatility: 0
    });

    // With 0% return and 0 volatility, final amount should be just contributions
    expect(result.finalAmount).toBeCloseTo(1300, 0); // 1000 + 100*3
  });
});

describe('calculateComparison', () => {
  test('should calculate positive difference when variable > fixed', () => {
    const result = calculateComparison(10000, 12000);
    expect(result).toBe(20); // (12000 - 10000) / 10000 * 100 = 20%
  });

  test('should calculate negative difference when variable < fixed', () => {
    const result = calculateComparison(10000, 8000);
    expect(result).toBe(-20); // (8000 - 10000) / 10000 * 100 = -20%
  });

  test('should return 0 when amounts are equal', () => {
    const result = calculateComparison(10000, 10000);
    expect(result).toBe(0);
  });

  test('should handle decimal values correctly', () => {
    const result = calculateComparison(10000, 10500);
    expect(result).toBe(5); // 5% increase
  });

  test('should handle large differences', () => {
    const result = calculateComparison(10000, 20000);
    expect(result).toBe(100); // 100% increase
  });

  test('should handle small fixed amounts', () => {
    const result = calculateComparison(100, 150);
    expect(result).toBe(50); // 50% increase
  });

  test('should return percentage as number', () => {
    const result = calculateComparison(10000, 11000);
    expect(typeof result).toBe('number');
    expect(result).toBe(10);
  });
});
