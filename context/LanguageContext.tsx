"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionary, Locale } from "@/lib/dictionary";

interface LanguageContextType {
    language: Locale;
    t: typeof dictionary.en;
    setLanguage: (lang: Locale) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Locale>("en");

    useEffect(() => {
        const browserLang = navigator.language;
        if (browserLang.startsWith("ko")) {
            setLanguage("ko");
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ko" : "en"));
    };

    const value = {
        language,
        t: dictionary[language],
        setLanguage,
        toggleLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
