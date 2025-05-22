import React from 'react';
import { Result } from '../Calculator';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { calculatePVMonthlyPayment } from '../../utils/pvCalculations';
import { calculateBatteryMonthlyPayment } from '../../utils/batteryCalculations';

type Props = {
  result: Result;
  onReset: () => void;
};

export const ResultsDisplay = ({ result, onReset }: Props) => {
  const TVA_RATE = 0.20; // 20% TVA

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="w-full max-w-lg bg-green-50 rounded-lg p-6 shadow-md border border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Résultat du calcul
        </h2>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">
            Le montant de l'abonnement est donné à titre indicatif et pourra être révisé par les équipes de SunLib.
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
