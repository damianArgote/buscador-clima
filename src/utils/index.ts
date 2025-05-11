export const formatTemperatureCelsius = (temp: number):number => {
    const kelvin = 273.15

    return parseInt((temp - kelvin).toString());
}


export function getTranslationFrom<T>(
  translations: Record<string, T>,
  lang: string,
  fallbackLang: string = 'es'
): T {
  if (!translations || typeof translations !== 'object') {
    throw new Error(`Invalid translations object.`);
  }

  const selected = translations[lang] || translations[fallbackLang];

  if (!selected || typeof selected !== 'object') {
    throw new Error(
      `No valid translation found for language "${lang}" or fallback "${fallbackLang}".`
    );
  }

  return selected;
}
