import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type DemoLevel = 'calibration' | ExperienceLevel;

interface DemoContextType {
  demoLevel: DemoLevel;
  setDemoLevel: (level: DemoLevel) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  hasCompletedMinimumSetup: boolean;
  setHasCompletedMinimumSetup: (val: boolean) => void;
  isInCalibration: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  // Default to calibration for first-time users without synced data
  const [demoLevel, setDemoLevel] = useState<DemoLevel>('calibration');
  // Store the actual experience level selected during onboarding
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('advanced');
  // Track if the user has completed the minimum required setup fields
  const [hasCompletedMinimumSetup, setHasCompletedMinimumSetup] = useState(false);

  // STRICT GATING: Calibration is active if explicitly set OR if minimum setup is not complete
  const isInCalibration = demoLevel === 'calibration' || !hasCompletedMinimumSetup;

  return (
    <DemoContext.Provider value={{ 
      demoLevel, 
      setDemoLevel,
      experienceLevel,
      setExperienceLevel,
      hasCompletedMinimumSetup,
      setHasCompletedMinimumSetup,
      isInCalibration
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
