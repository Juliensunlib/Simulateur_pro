import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-3 text-center text-sm">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} SunLib - Tous droits réservés</p>
        <p className="text-green-200 mt-1">Solutions d'énergie renouvelable</p>
      </div>
    </footer>
  );
};