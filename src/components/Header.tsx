import React from 'react';
import { Sun, Battery } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="h-8 w-8 text-yellow-300" />
          <Battery className="h-8 w-8 text-blue-300" />
          <h1 className="text-2xl font-bold">SunLib Calculator</h1>
        </div>
        <div className="text-sm md:text-base">
          Simulateur d'abonnement d'autoconsommation solaire
        </div>
      </div>
    </header>
  );
};
