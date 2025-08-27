'use client';
import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff, Info, X } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/others/Password-Hover-Card';
const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special characters' },
];
const STRENGTH_CONFIG = {
  colors: {
    0: 'border-border',
    1: 'border-red-500',
    2: 'border-orange-500',
    3: 'border-amber-500',
    4: 'border-green-400',
    5: 'border-emerald-500',
  },
  texts: {
    0: 'Enter a password',
    1: 'Weak password',
    2: 'Medium password!',
    3: 'Strong password!!',
    4: 'Very Strong password!!!',
  },
};
const PasswordInput = ({password,onChange}) => {
  const [isVisible, setIsVisible] = useState(false);
  const calculateStrength = useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }));
    return {
      score: requirements.filter((req) => req.met).length,
      requirements,
    };
  }, [password]);
  return (
    <div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="text-sm">
            Enter your Password
          </label>
          <HoverCard openDelay={200}>
            <HoverCardTrigger>
              <Info
                size={20}
                className={`cursor-pointer  ${STRENGTH_CONFIG.colors[calculateStrength.score]} transition-all `}
              />
            </HoverCardTrigger>
            <HoverCardContent className="bg-background">
              <ul className="space-y-1.5" aria-label="Password requirements">
                {calculateStrength.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {req.met ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <X size={16} className="text-muted-foreground/80" />
                    )}
                    <span
                      className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                    >
                      {req.text}
                      <span className="sr-only">
                        {req.met
                          ? ' - Requirement met'
                          : ' - Requirement not met'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isVisible ? 'text' : 'password'}
            value={password}
            onChange={onChange}
            placeholder="Password"
            aria-invalid={calculateStrength.score < 4}
            aria-describedby="password-strength"
            className={`${STRENGTH_CONFIG.colors[calculateStrength.score]} transition-all w-full p-2 border-2 rounded-md outline-none  transition `}
          />
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground  "
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PasswordInput;
