import React, { useState } from 'react';
import { Result } from '../Calculator';
import { calculatePVMonthlyPayment, getPVRate } from '../../utils/pvCalculations';
import { calculateBatteryMonthlyPayment, getBatteryRate } from '../../utils/batteryCalculations';

type Props = {
  setResult: (result: Result) => void;
};

export const CombinedForm = ({ setResult }: Props) => {
  // PV state
  const [pvPrice, setPvPrice] = useState('');
  const [pvPower, setPvPower] = useState('');
  const [pvDuration, setPvDuration] = useState('25');
  
  // Battery state
  const [batteryPrice, setBatteryPrice] = useState('');
  const [batteryPower, setBatteryPower] = useState('');
  const [batteryDuration, setBatteryDuration] = useState('10');
  
  // Errors
  const [errors, setErrors] = useState<{
    pvPrice?: string; 
    pvPower?: string;
    batteryPrice?: string;
    batteryPower?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      pvPrice?: string; 
      pvPower?: string;
      batteryPrice?: string;
      batteryPower?: string;
    } = {};
    
    // Validate PV
    if (!pvPrice) {
      newErrors.pvPrice = "Le prix est requis";
    } else if (isNaN(parseFloat(pvPrice))) {
      newErrors.pvPrice = "Le prix doit être un nombre";
    }
    
    if (!pvPower) {
      newErrors.pvPower = "La puissance est requise";
    } else if (isNaN(parseFloat(pvPower))) {
      newErrors.pvPower = "La puissance doit être un nombre";
    } else if (parseFloat(pvPower) < 36.5 || parseFloat(pvPower) > 500) {
      newErrors.pvPower = "La puissance doit être entre 36.5 et 500 kWc";
    }
    
    // Validate Battery
    if (!batteryPrice) {
      newErrors.batteryPrice = "Le prix est requis";
    } else if (isNaN(parseFloat(batteryPrice))) {
      newErrors.batteryPrice = "Le prix doit être un nombre";
    }
    
    if (!batteryPower) {
      newErrors.batteryPower = "La puissance est requise";
    } else if (isNaN(parseFloat(batteryPower))) {
      newErrors.batteryPower = "La puissance doit être un nombre";
    } else if (parseFloat(batteryPower) <= 0) {
      newErrors.batteryPower = "La puissance doit être supérieure à 0";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate result
    if (Object.keys(newErrors).length === 0) {
      // PV calculations
      const numPvPrice = parseFloat(pvPrice);
      const numPvPower = parseFloat(pvPower);
      const numPvDuration = parseInt(pvDuration);
      
      // Battery calculations
      const numBatteryPrice = parseFloat(batteryPrice);
      const numBatteryPower = parseFloat(batteryPower);
      const numBatteryDuration = parseInt(batteryDuration);
      
      try {
        // Calculate rates
        const pvRate = getPVRate(numPvDuration, numPvPower);
        const batteryRate = getBatteryRate(numBatteryDuration);
        
        // Calculate monthly costs
        const pvMonthlyCost = calculatePVMonthlyPayment(numPvPrice, numPvPower, numPvDuration);
        const batteryMonthlyCost = calculateBatteryMonthlyPayment(numBatteryPrice, numBatteryDuration);
        
        // Total monthly cost
        const totalMonthlyCost = pvMonthlyCost + batteryMonthlyCost;
        
        setResult({
          type: 'combined',
          monthlyCost: totalMonthlyCost,
          details: {
            pv: {
              price: numPvPrice,
              power: numPvPower,
              duration: numPvDuration,
              contractType: 'Variable',
              rate: pvRate
            },
            battery: {
              price: numBatteryPrice,
              power: numBatteryPower,
              duration: numBatteryDuration,
              rate: batteryRate
            }
          }
        });
      } catch (error) {
        setResult({
          type: 'combined',
          monthlyCost: null,
          errorMessage: `Erreur de calcul: ${(error as Error).message}`
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800">
        Calcul d'abonnement - PV + Batterie Pro
      </h2>
      
      {/* PV Section */}
      <div className="border-l-4 border-green-500 pl-4 pb-2">
        <h3 className="font-medium mb-4 text-green-700">Panneaux Photovoltaïques</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix installation HT (€)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={pvPrice}
              onChange={(e) => setPvPrice(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.pvPrice ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
              placeholder="Ex: 100000"
            />
            {errors.pvPrice && <p className="mt-1 text-sm text-red-600">{errors.pvPrice}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puissance installée (kWc)
            </label>
            <input
              type="number"
              min="36.5"
              max="500"
              step="0.1"
              value={pvPower}
              onChange={(e) => setPvPower(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.pvPower ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
              placeholder="Ex: 100"
            />
            {errors.pvPower && <p className="mt-1 text-sm text-red-600">{errors.pvPower}</p>}
            <p className="mt-1 text-xs text-gray-500">Entre 36.5 et 500 kWc</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée d'abonnement
          </label>
          <select
            value={pvDuration}
            onChange={(e) => setPvDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="25">25 ans</option>
            <option value="20">20 ans</option>
            <option value="15">15 ans</option>
            <option value="10">10 ans</option>
          </select>
        </div>
      </div>
      
      {/* Battery Section */}
      <div className="border-l-4 border-blue-500 pl-4 mt-6 pb-2">
        <h3 className="font-medium mb-4 text-blue-700">Batterie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix de la batterie HT (€)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={batteryPrice}
              onChange={(e) => setBatteryPrice(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.batteryPrice ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
              placeholder="Ex: 50000"
            />
            {errors.batteryPrice && <p className="mt-1 text-sm text-red-600">{errors.batteryPrice}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puissance de la batterie (kWh)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={batteryPower}
              onChange={(e) => setBatteryPower(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.batteryPower ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
              placeholder="Ex: 100"
            />
            {errors.batteryPower && <p className="mt-1 text-sm text-red-600">{errors.batteryPower}</p>}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée d'abonnement
          </label>
          <select
            value={batteryDuration}
            onChange={(e) => setBatteryDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="15">15 ans</option>
            <option value="10">10 ans</option>
          </select>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors font-medium"
        >
          Calculer la mensualité combinée
        </button>
      </div>
    </form>
  );
};