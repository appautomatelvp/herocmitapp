import React from 'react';
import { XCircle } from 'lucide-react';
import { getThemeColors, getDisplayGroup, getInitials } from '../lib/utils.js';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-50 p-5 ${className}`}>
    {children}
  </div>
);

export const GroupBadge = ({ group, code }) => {
  const theme = getThemeColors(group, code);
  const displayGroup = getDisplayGroup(group, code);
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${theme.badge}`}>
      {displayGroup}
    </span>
  );
};

export const Avatar = ({ src, alt, size = 'md', theme }) => {
  const sizeClass = size === 'lg' ? 'w-24 h-24 text-3xl' : size === 'xl' ? 'w-32 h-32 text-4xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10';
  if (src) {
    return <img src={src} alt={alt} className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm bg-gray-200`} />;
  }
  const bgClass = theme ? theme.primaryLightBg : 'bg-indigo-100';
  const textClass = theme ? theme.primaryText : 'text-indigo-700';
  return (
    <div className={`${sizeClass} rounded-full ${bgClass} flex items-center justify-center ${textClass} font-bold border-2 border-white shadow-sm`}>
      {getInitials(alt)}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, onTitleClick }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 select-none cursor-pointer" onClick={onTitleClick}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><XCircle size={20} className="text-gray-500"/></button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
