import React, { useState } from 'react';
import { Result } from '../Calculator';
import { calculatePVMonthlyPayment, getPVRate } from '../../utils/pvCalculations';

type Props = {
  setResult: (result: Result) => void;
};

export const PVForm = ({ setResult }: Props) => {
  const [price, setPrice] = useState('');
  const [power, setPower] = useState('');
  const [duration, setDuration] = useState('25');
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
    } else if (parseFloat(power) < 36.5 || parseFloat(power) > 500) {
      newErrors.power = "La puissance doit être entre 36.5 et 500 kWc";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate result
    if (Object.keys(newErrors).length === 0) {
      const numPrice = parseFloat(price);
      const numPower = parseFloat(power);
      const numDuration = parseInt(duration);
      
      try {
        const rate = getPVRate(numDuration, numPower);
        const monthlyCost = calculatePVMonthlyPayment(numPrice, numPower, numDuration);
        
        setResult({
          type: 'pv',
          monthlyCost,
          details: {
            pv: {
              price: numPrice,
              power: numPower,
              duration: numDuration,
              contractType: 'Variable',
              rate
            }
          }
        });
      } catch (error) {
        setResult({
          type: 'pv',
          monthlyCost: null,
          errorMessage: `Erreur de calcul: ${(error as Error).message}`
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800">
        Calcul d'abonnement - Panneaux Photovoltaïques Pro
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix installation HT (€)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
            placeholder="Ex: 100000"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
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
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.power ? 'border-red-300' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500`}
            placeholder="Ex: 100"
          />
          {errors.power && <p className="mt-1 text-sm text-red-600">{errors.power}</p>}
          <p className="mt-1 text-xs text-gray-500">Entre 36.5 et 500 kWc</p>
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
          <option value="25">25 ans</option>
          <option value="20">20 ans</option>
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