import React, { useState } from 'react';
import { Result } from '../Calculator';
import { calculateBatteryMonthlyPayment, getBatteryRate } from '../../utils/batteryCalculations';

type Props = {
  setResult: (result: Result) => void;
};

export const BatteryForm = ({ setResult }: Props) => {
  const [price, setPrice] = useState('');
  const [power, setPower] = useState('');
  const [duration, setDuration] = useState('10');
  const [errors, setErrors] = useState<{price?: string; power?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {price?: string; power?: string} = {};
    
    if (!price) {
      newErrors.price = "Le prix est requis";
    } else if (isNaN(parseFloat(price))) {
      newErrors.price = "Le prix doit être un nombre";
    }
    
    if (!power) {
      newErrors.power = "La puissance est requise";
    } else if (isNaN(parseFloat(power))) {
      newErrors.power = "La puissance doit être un nombre";
    } else if (parseFloat(power) <= 0) {
      newErrors.power = "La puissance doit être supérieure à 0";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate result
    if (Object.keys(newErrors).length === 0) {
      const numPrice = parseFloat(price);
      const numPower = parseFloat(power);
      const numDuration = parseInt(duration);
      
      try {
        const rate = getBatteryRate(numDuration);
        const monthlyCost = calculateBatteryMonthlyPayment(numPrice, numDuration);
        
        setResult({
          type: 'battery',
          monthlyCost,
          details: {
            battery: {
              price: numPrice,
              power: numPower,
              duration: numDuration,
              rate
            }
          }
        });
      } catch (error) {
        setResult({
          type: 'battery',
          monthlyCost: null,
          errorMessage: `Erreur de calcul: ${(error as Error).message}`
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800">
        Calcul d'abonnement - Batterie Pro
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix de la batterie HT (€)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
            placeholder="Ex: 50000"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puissance de la batterie (kWh)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.power ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
            placeholder="Ex: 100"
          />
          {errors.power && <p className="mt-1 text-sm text-red-600">{errors.power}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Durée d'abonnement
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        >
          <option value="15">15 ans</option>
          <option value="10">10 ans</option>
        </select>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors font-medium"
        >
          Calculer la mensualité
        </button>
      </div>
    </form>
  );
};