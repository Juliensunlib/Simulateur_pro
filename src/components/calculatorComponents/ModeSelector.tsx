import React from 'react';
import { Sun, Battery, BatteryCharging } from 'lucide-react';

type Props = {
  currentMode: 'pv' | 'battery' | 'combined';
  onChange: (mode: 'pv' | 'battery' | 'combined') => void;
};

export const ModeSelector = ({ currentMode, onChange }: Props) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-4 px-4 flex flex-col items-center transition-colors ${
          currentMode === 'pv'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
        onClick={() => onChange('pv')}
      >
        <Sun className={`h-6 w-6 ${currentMode === 'pv' ? 'text-yellow-300' : 'text-yellow-500'}`} />
        <span className="mt-1 font-medium">Panneaux PV</span>
      </button>

      <button
        className={`flex-1 py-4 px-4 flex flex-col items-center transition-colors ${
          currentMode === 'battery'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
        onClick={() => onChange('battery')}
      >
        <Battery className={`h-6 w-6 ${currentMode === 'battery' ? 'text-blue-300' : 'text-blue-500'}`} />
        <span className="mt-1 font-medium">Batterie</span>
      </button>

      <button
        className={`flex-1 py-4 px-4 flex flex-col items-center transition-colors ${
          currentMode === 'combined'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
        onClick={() => onChange('combined')}
      >
        <BatteryCharging className={`h-6 w-6 ${currentMode === 'combined' ? 'text-purple-300' : 'text-purple-500'}`} />
        <span className="mt-1 font-medium">PV + Batterie</span>
      </button>
    </div>
  );
};