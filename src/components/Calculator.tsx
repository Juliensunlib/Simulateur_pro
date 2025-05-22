import React, { useState } from 'react';
import { ModeSelector } from './calculatorComponents/ModeSelector';
import { PVForm } from './calculatorComponents/PVForm';
import { BatteryForm } from './calculatorComponents/BatteryForm';
import { CombinedForm } from './calculatorComponents/CombinedForm';
import { ResultsDisplay } from './calculatorComponents/ResultsDisplay';

type CalculationMode = 'pv' | 'battery' | 'combined';

export type Result = {
  type: 'pv' | 'battery' | 'combined';
  monthlyCost: number | null;
  errorMessage?: string;
  details?: {
    pv?: {
      price: number;
      power: number;
      duration: number;
      contractType: string;
      rate: number;
    };
    battery?: {
      price: number;
      power: number;
      duration: number;
      rate: number;
    };
  };
};

export const Calculator = () => {
  const [mode, setMode] = useState<CalculationMode>('pv');
  const [result, setResult] = useState<Result | null>(null);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300">
      <ModeSelector currentMode={mode} onChange={setMode} />
      
      <div className="p-6">
        {result ? (
          <ResultsDisplay result={result} onReset={handleReset} />
        ) : (
          <>
            {mode === 'pv' && <PVForm setResult={setResult} />}
            {mode === 'battery' && <BatteryForm setResult={setResult} />}
            {mode === 'combined' && <CombinedForm setResult={setResult} />}
          </>
        )}
      </div>
    </div>
  );
};