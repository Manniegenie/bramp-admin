import { ChevronDown } from 'lucide-react';
import React from 'react';

interface ProfileDropdownProps {
    user: { name?: string; adminName?: string; email?: string };
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
    position?: 'top' | 'bottom';
    background?: string;
    nameColor?: string;
    emailColor?: string;
    icon?: React.ComponentType<any>;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isOpen, onToggle, onLogout, position = 'bottom', background, nameColor, emailColor, icon }) => {
  const displayName = user?.name || user?.adminName || '';
  const abbreviation = displayName.split(' ').map((n) => n[0]).join('');
  return (
    <div className="relative">
      <button
        className={`flex justify-between w-full items-center space-x-4 ${background} py-2 px-3 rounded-lg focus:outline-none`}
        type="button"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 px-2 py-1.5 rounded-md font-semibold">
              {abbreviation}
          </div>
          <div className="text-left">
              <p className={`text-sm font-medium ${nameColor}`}>{displayName}</p>
              <p className={`text-xs ${emailColor}`}>{user?.email}</p>
          </div>
        </div>
        {icon ? React.createElement(icon, { className: "w-4 h-4 ml-2" }) : <ChevronDown className="w-4 h-4 ml-2" />}
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 ${position === 'top' ? 'bottom-full mb-2' : 'mt-2'} w-55 bg-white rounded-md shadow-lg z-50`}
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm text-black font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            className="w-full text-left text-red-500 font-semibold px-4 py-2 text-sm hover:bg-gray-100"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
