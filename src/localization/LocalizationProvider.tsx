import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { I18nManager } from 'react-native';
import { translations, SupportedLanguage } from './translations';

type LocalizationContextValue = {
  language: SupportedLanguage;
  isRTL: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
  textAlign: 'left' | 'right';
  rowDirection: 'row' | 'row-reverse';
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

const resolveDeviceLanguage = (): SupportedLanguage => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale?.toLowerCase() || 'en';

  if (locale.startsWith('fr')) {
    return 'fr';
  }

  if (locale.startsWith('ar')) {
    return 'ar';
  }

  return 'en';
};

const interpolate = (value: string, vars?: Record<string, string | number>) => {
  if (!vars) {
    return value;
  }

  return Object.entries(vars).reduce(
    (output, [key, varValue]) => output.replace(new RegExp(`\\{${key}\\}`, 'g'), String(varValue)),
    value
  );
};

const isTranslationLeaf = (value: unknown): value is string => typeof value === 'string';

const resolveNestedValue = (value: unknown, parts: string[]) => {
  let current = value;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
};

const getTranslationValue = (language: SupportedLanguage, key: string) => {
  const parts = key.split('.');
  const current = resolveNestedValue(translations[language], parts);
  if (isTranslationLeaf(current)) {
    return current;
  }

  const fallback = resolveNestedValue(translations.en, parts);
  return isTranslationLeaf(fallback) ? fallback : key;
};

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const language = resolveDeviceLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    I18nManager.allowRTL(isRTL);
    I18nManager.swapLeftAndRightInRTL(isRTL);
  }, [isRTL]);

  const value = useMemo<LocalizationContextValue>(
    () => ({
      language,
      isRTL,
      textAlign: isRTL ? 'right' : 'left',
      rowDirection: isRTL ? 'row-reverse' : 'row',
      t: (key, vars) => interpolate(getTranslationValue(language, key), vars),
    }),
    [isRTL, language]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useI18n must be used inside LocalizationProvider');
  }

  return context;
};
