// Battery price thresholds and rate calculations

// Battery threshold check
export function isBatteryPriceWithinThreshold(price: number, power: number): boolean {
  // No price threshold for professional installations
  return true;
}

// Get battery annual rate based on duration
export function getBatteryRate(duration: number): number {
  // Taux fixe en fonction de la durée
  switch (duration) {
    case 25: return 0.10;
    case 20: return 0.103;
    case 15: return 0.106;
    case 10: return 0.115;
    default: throw new Error("Durée non prise en charge");
  }
}

// Calculate monthly payment for battery
export function calculateBatteryMonthlyPayment(price: number, duration: number): number {
  const annualRate = getBatteryRate(duration);
  const monthlyRate = annualRate / 12;
  const months = duration * 12;

  // Formule de mensualité (type PMT)
  const monthlyPayment = (price * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(monthlyPayment * 100) / 100;
}