'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const router = useRouter();

  useEffect(() => {
    // Check if PIN has been set up
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: '0000', action: 'check' }) })
      .then(res => {
        if (res.status === 404) setIsSetup(false);
        else setIsSetup(true);
      })
      .catch(() => setIsSetup(true));
  }, []);

  const handleDigit = (digit: string) => {
    setError('');
    if (step === 'confirm') {
      if (confirmPin.length < 6) setConfirmPin(prev => prev + digit);
    } else {
      if (pin.length < 6) setPin(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    if (step === 'confirm') {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    const currentPin = step === 'confirm' ? confirmPin : pin;
    if (currentPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    if (!isSetup && step === 'enter') {
      setStep('confirm');
      return;
    }

    if (!isSetup && step === 'confirm') {
      if (pin !== confirmPin) {
        setError('PINs do not match');
        setConfirmPin('');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pin,
          action: isSetup ? 'login' : 'setup',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed');
        setPin('');
        setConfirmPin('');
        setStep('enter');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          Supplemental Workouts
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
          {isSetup === false
            ? step === 'confirm'
              ? 'Confirm your PIN'
              : 'Create a PIN to get started'
            : 'Enter your PIN'}
        </p>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < currentPin.length
                  ? 'bg-blue-600 dark:bg-blue-400 scale-110'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        {/* Numeric pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-16 rounded-xl bg-white dark:bg-gray-800 text-2xl font-medium
                text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200
                dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-700
                transition-colors touch-manipulation"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium
              text-gray-600 dark:text-gray-400 active:bg-gray-200 dark:active:bg-gray-700
              transition-colors touch-manipulation"
          >
            Delete
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-xl bg-white dark:bg-gray-800 text-2xl font-medium
              text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200
              dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-700
              transition-colors touch-manipulation"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            disabled={currentPin.length < 4 || loading}
            className="h-16 rounded-xl bg-blue-600 dark:bg-blue-500 text-white text-sm
              font-semibold disabled:opacity-40 active:bg-blue-700 dark:active:bg-blue-600
              transition-colors touch-manipulation"
          >
            {loading ? '...' : step === 'confirm' ? 'Confirm' : isSetup ? 'Enter' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
