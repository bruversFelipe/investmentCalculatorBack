export function calculateIR(grossProfit, periodMonths) {
  const periodDays = periodMonths * 30;
  let rate;
  
  if (periodDays <= 180) {
    rate = 0.225;
  } else if (periodDays <= 360) {
    rate = 0.20;
  } else if (periodDays <= 720) {
    rate = 0.175;
  } else {
    rate = 0.15;
  }
  
  return grossProfit * rate;
}

export function calculateIOF(grossProfit, periodMonths) {
  const periodDays = periodMonths * 30;
  
  if (periodDays >= 30) {
    return 0;
  }
  
  if (periodDays === 1) {
    return grossProfit * 0.96;
  }
  
  const rate = (96 - (3 * (periodDays - 1))) / 100;
  return grossProfit * rate;
}

export function normalRandom(mean, stdDev) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return mean + z0 * stdDev;
}

export function calculateFixedIncome(params) {
  const { initialAmount, monthlyContribution, periodMonths, annualRate } = params;
  
  const monthlyRate = annualRate / 12 / 100;
  
  let currentValue = initialAmount;
  
  const monthlyEvolution = [{ month: 0, value: initialAmount }];
  
  for (let month = 1; month <= periodMonths; month++) {
    currentValue = currentValue * (1 + monthlyRate);
    
    currentValue += monthlyContribution;
    
    monthlyEvolution.push({ month, value: currentValue });
  }
  
  const finalAmount = currentValue;
  
  const totalInvested = initialAmount + (monthlyContribution * periodMonths);
  
  const grossProfit = finalAmount - totalInvested;
  
  const ir = calculateIR(grossProfit, periodMonths);
  
  const iof = calculateIOF(grossProfit, periodMonths);
  
  const netProfit = grossProfit - ir - iof;
  
  return {
    finalAmount,
    totalInvested,
    grossProfit,
    netProfit,
    ir,
    iof,
    monthlyEvolution
  };
}

export function calculateVariableIncome(params) {
  const { initialAmount, monthlyContribution, periodMonths, annualReturn, volatility } = params;
  
  const monthlyReturn = annualReturn / 12 / 100;
  const monthlyVolatility = volatility / Math.sqrt(12) / 100;
  
  let currentValue = initialAmount;
  
  const monthlyEvolution = [{ month: 0, value: initialAmount }];
  
  for (let month = 1; month <= periodMonths; month++) {
    const randomReturn = normalRandom(monthlyReturn, monthlyVolatility);
    
    currentValue = currentValue * (1 + randomReturn);
    
    currentValue += monthlyContribution;
    
    monthlyEvolution.push({ month, value: currentValue });
  }
  
  const finalAmount = currentValue;
  
  const totalInvested = initialAmount + (monthlyContribution * periodMonths);
  
  const grossProfit = finalAmount - totalInvested;
  
  return {
    finalAmount,
    totalInvested,
    grossProfit,
    monthlyEvolution
  };
}

export function calculateComparison(fixedFinalAmount, variableFinalAmount) {
  const difference = variableFinalAmount - fixedFinalAmount;
  const percentDifference = (difference / fixedFinalAmount) * 100;
  return percentDifference;
}
