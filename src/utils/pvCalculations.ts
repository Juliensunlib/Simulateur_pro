// PV price thresholds and rate calculations

// For professional installations, we don't have a maximum price threshold
export function isPVPriceWithinThreshold(price: number, power: number): boolean {
  // No price threshold for professional installations
  return true;
}

// Get PV max price threshold
export function getPVMaxPrice(power: number): number {
  // No maximum price for professional installations
  return Infinity;
}

// Get PV rate table reference values
function getRateTableValue(durationIndex: number, powerIndex: number): number {
  // Variable rate table reference values by duration and power index
  // For professional installations, we use the 36 kWc rates
  const taux_variable = {
    25: 11.00, // Rate for 36 kWc at 25 years
    20: 11.25, // Rate for 36 kWc at 20 years
    15: 11.60, // Rate for 36 kWc at 15 years
    10: 12.50, // Rate for 36 kWc at 10 years
  };
  
  return taux_variable[durationIndex as keyof typeof taux_variable];
}

// Get PV rate
export function getPVRate(duration: number, power: number): number {
  if (power < 36.5 || power > 500) {
    throw new Error("Puissance hors limites (36.5-500 kWc)");
  }
  
  // For professional installations, always use the 36 kWc rate
  const ratePercentage = getRateTableValue(duration, 0);
  
  // Convert percentage to decimal
  return ratePercentage / 100;
}

// Calculate monthly payment for PV
export function calculatePVMonthlyPayment(price: number, power: number, duration: number): number {
  const annualRate = getPVRate(duration, power);
  const monthlyRate = annualRate / 12;
  const months = duration * 12;
  
  // Monthly payment formula (PMT)
  const monthlyPayment = price * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(monthlyPayment * 100) / 100;
}