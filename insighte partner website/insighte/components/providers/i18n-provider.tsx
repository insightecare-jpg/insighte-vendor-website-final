"use client";

import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

export function I18nProvider({ 
  children, 
  locale, 
  messages 
}: { 
  children: React.ReactNode; 
  locale: string; 
  messages: any;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kolkata">
      {children}
    </NextIntlClientProvider>
  );
}
