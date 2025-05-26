import React, { useState } from 'react';
import { Result } from '../Calculator';
import { ArrowLeft, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { calculatePVMonthlyPayment } from '../../utils/pvCalculations';
import { calculateBatteryMonthlyPayment } from '../../utils/batteryCalculations';

type Props = {
  result: Result;
  onReset: () => void;
};

export const ResultsDisplay = ({ result, onReset }: Props) => {
  const [showResidualValues, setShowResidualValues] = useState(false);
  const TVA_RATE = 0.20; // 20% TVA

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getPVResidualPercentages = (duration: number) => {
    const percentages = {
      "25": [106.0, 105.0, 104.0, 103.0, 102.0, 101.0, 99.0, 96.0, 95.0, 94.0, 93.0, 92.0, 91.0, 90.0, 87.0, 80.0, 71.0, 64.0, 55.0, 46.0, 36.0, 24.0, 12.8],
      "20": [106.0, 105.0, 104.0, 103.0, 102.0, 100.0, 96.0, 93.0, 90.0, 86.0, 80.0, 75.0, 66.0, 59.0, 47.4, 37.8, 24.0, 12.9],
      "15": [97.5, 95.0, 93.0, 91.0, 89.0, 86.0, 81.0, 75.0, 69.0, 61.0, 51.0, 37.0, 13.8],
      "10": [94.0, 91.0, 87.0, 81.0, 71.0, 60.0, 42.0, 15.5]
    };
    return percentages[duration.toString()] || [];
  };

  const getBatteryResidualPercentages = (duration: number) => {
    const percentages = {
      "15": [94.5, 93.1, 91.3, 89.1, 86.3, 82.8, 78.4, 72.8, 65.8, 57.1, 46.0, 32.2, 14.8],
      "10": [94.0, 91.2, 87.2, 81.4, 64.7, 60.4, 42.2, 15.8]
    };
    return percentages[duration.toString()] || [];
  };

  const calculateResidualValues = (initialPrice: number, duration: number, type: 'pv' | 'battery') => {
    const percentages = type === 'pv' ? 
      getPVResidualPercentages(duration) : 
      getBatteryResidualPercentages(duration);

    return percentages.map((percentage, index) => ({
      year: index + 2,
      value: Math.round(initialPrice * percentage / 100 * 100) / 100
    }));
  };

  const renderResidualValuesTable = () => {
    if (!showResidualValues) return null;

    if (result.type === 'combined' && result.details?.pv && result.details?.battery) {
      const pvValues = calculateResidualValues(result.details.pv.price, result.details.pv.duration, 'pv');
      const batteryValues = calculateResidualValues(result.details.battery.price, result.details.battery.duration, 'battery');
      
      // Get all unique years
      const years = new Set([
        ...pvValues.map(v => v.year),
        ...batteryValues.map(v => v.year)
      ].sort((a, b) => a - b));

      return (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Valeurs résiduelles combinées</h4>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Année</th>
                  <th className="pb-2 text-green-700">PV</th>
                  <th className="pb-2 text-blue-700">Batterie</th>
                  <th className="pb-2 text-green-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(years).map(year => {
                  const pvValue = pvValues.find(v => v.year === year)?.value || 0;
                  const batteryValue = batteryValues.find(v => v.year === year)?.value || 0;
                  const totalValue = pvValue + batteryValue;

                  return (
                    <tr key={year} className="border-t border-gray-100">
                      <td className="py-2">{year}</td>
                      <td className="py-2 text-green-600">{formatPrice(pvValue)} €</td>
                      <td className="py-2 text-blue-600">{formatPrice(batteryValue)} €</td>
                      <td className="py-2 text-green-600 font-medium">{formatPrice(totalValue)} €</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      const values = calculateResidualValues(
        result.type === 'pv' ? result.details?.pv?.price || 0 : result.details?.battery?.price || 0,
        result.type === 'pv' ? result.details?.pv?.duration || 0 : result.details?.battery?.duration || 0,
        result.type
      );

      const textColorClass = result.type === 'pv' ? 'text-green-600' : 'text-blue-600';

      return (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Valeurs résiduelles</h4>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Année</th>
                  <th className={`pb-2 ${textColorClass}`}>Valeur HT</th>
                </tr>
              </thead>
              <tbody>
                {values.map(({ year, value }) => (
                  <tr key={year} className="border-t border-gray-100">
                    <td className="py-2">{year}</td>
                    <td className={`py-2 ${textColorClass}`}>{formatPrice(value)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full max-w-lg bg-green-50 rounded-lg p-6 shadow-md border border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Résultat du calcul
        </h2>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">
            Le montant de l'abonnement est à titre indicatif et sera revu par les équipes de SunLib.
          </p>
        </div>

        {result.errorMessage ? (
          <div className="flex items-center justify-center bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded">
            <AlertCircle className="h-6 w-6 mr-2 flex-shrink-0" />
            <span>{result.errorMessage}</span>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Type d'abonnement:</span>
                <span className="font-semibold">
                  {result.type === 'pv' && 'Panneaux Photovoltaïques'}
                  {result.type === 'battery' && 'Batterie'}
                  {result.type === 'combined' && 'PV + Batterie'}
                </span>
              </div>

              {result.details?.pv && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <h3 className="font-medium text-green-700 mb-2">Détails PV</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Prix HT:</span>
                    <span className="font-medium">{formatPrice(result.details.pv.price)} €</span>
                    <span className="text-gray-500">Prix TTC:</span>
                    <span className="font-medium">{formatPrice(result.details.pv.price * (1 + TVA_RATE))} €</span>
                    <span className="text-gray-500">Puissance:</span>
                    <span className="font-medium">{result.details.pv.power} kWc</span>
                    <span className="text-gray-500">Durée:</span>
                    <span className="font-medium">{result.details.pv.duration} ans</span>
                    <span className="text-gray-500">Mensualité HT:</span>
                    <span className="font-medium">{formatPrice(calculatePVMonthlyPayment(result.details.pv.price, result.details.pv.power, result.details.pv.duration))} €</span>
                  </div>
                </div>
              )}

              {result.details?.battery && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <h3 className="font-medium text-blue-700 mb-2">Détails Batterie</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Prix HT:</span>
                    <span className="font-medium">{formatPrice(result.details.battery.price)} €</span>
                    <span className="text-gray-500">Prix TTC:</span>
                    <span className="font-medium">{formatPrice(result.details.battery.price * (1 + TVA_RATE))} €</span>
                    <span className="text-gray-500">Puissance:</span>
                    <span className="font-medium">{result.details.battery.power} kWh</span>
                    <span className="text-gray-500">Durée:</span>
                    <span className="font-medium">{result.details.battery.duration} ans</span>
                    <span className="text-gray-500">Mensualité HT:</span>
                    <span className="font-medium">{formatPrice(calculateBatteryMonthlyPayment(result.details.battery.price, result.details.battery.duration))} €</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowResidualValues(!showResidualValues)}
                className="mt-4 w-full py-2 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {showResidualValues ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                {showResidualValues ? 'Masquer les valeurs résiduelles' : 'Afficher les valeurs résiduelles'}
              </button>

              {renderResidualValuesTable()}
            </div>

            <div className="bg-green-600 text-white rounded-lg p-4 text-center">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-200" />
                <p className="text-base">Mensualité totale:</p>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-lg">
                  HT: <span className="font-bold">{formatPrice(result.monthlyCost!)} €</span>
                </p>
                <p className="text-3xl font-bold">
                  TTC: {formatPrice(result.monthlyCost! * (1 + TVA_RATE))} €
                </p>
              </div>
            </div>
          </>
        )}

        <button
          onClick={onReset}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Nouveau calcul
        </button>
      </div>
    </div>
  );
};
