import React, { useState, useEffect, useRef } from 'react';

interface WelcomeSplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

/**
 * Automatic Welcome Splash Animation with the official Logo_Presentacion.png
 * Features dynamic entry pop, gentle floating animation, soft brand aura glow,
 * and seamless auto-transition into the application.
 */
export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onFinish,
  durationMs = 1200,
}) => {
  // Check if user already saw the splash in this browser session or arrived via direct deep link
  const [isMounted, setIsMounted] = useState(() => {
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const search = typeof window !== 'undefined' ? window.location.search : '';
      if (
        path.startsWith('/anuncio/') ||
        path.startsWith('/comercio/') ||
        path.startsWith('/reel/') ||
        path.startsWith('/p/') ||
        path.startsWith('/plan/') ||
        path.startsWith('/itinerario/') ||
        search.includes('post=') ||
        search.includes('reel=') ||
        search.includes('anuncio=') ||
        search.includes('biz=') ||
        search.includes('comercio=') ||
        search.includes('plan=') ||
        search.includes('itinerario=') ||
        search.includes('tab=') ||
        search.includes('seccion=')
      ) {
        return false;
      }
      return sessionStorage.getItem('oleveci_welcome_seen') !== 'true';
    } catch {
      return false;
    }
  });

  const [isStarted, setIsStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const dismissSplash = React.useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    try {
      sessionStorage.setItem('oleveci_welcome_seen', 'true');
    } catch {
      // Storage unavailable
    }
    if (onFinishRef.current) onFinishRef.current();
    setIsExiting(true);
    setTimeout(() => {
      setIsMounted(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      if (onFinishRef.current && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onFinishRef.current();
      }
      return;
    }

    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, 30);

    const exitTimer = setTimeout(() => {
      dismissSplash();
    }, durationMs);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
    };
  }, [durationMs, isMounted, dismissSplash]);

  if (!isMounted) return null;

  return (
    <div
      onClick={dismissSplash}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6 select-none overflow-hidden transition-opacity duration-300 ease-out cursor-pointer ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Bienvenido a OleVeci"
    >
      {/* Dynamic Brand Aura Background */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#007af7]/12 via-[#ff7700]/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute w-80 h-80 rounded-full bg-[#041f5e]/6 blur-2xl pointer-events-none" />

      {/* Main Animated Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-xs sm:max-w-sm w-full text-center">
        <div
          className={`relative transition-all duration-700 ease-out transform ${
            isStarted
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {/* Subtle luminous halo behind transparent logo */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#007af7]/20 via-[#ff7700]/15 to-transparent rounded-full blur-2xl -z-10 animate-pulse-glow" />

          {/* Transparent Logo with gentle floating hover animation */}
          <div className={isStarted && !isExiting ? 'animate-float-logo' : ''}>
            <img
              src="/Logo_Presentacion.png"
              alt="OleVeci.com - Negocios locales, más cerca de ti"
              className="w-56 sm:w-64 md:w-72 h-auto object-contain mx-auto drop-shadow-sm"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
