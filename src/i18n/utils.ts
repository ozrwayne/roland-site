import en from './en.json';
import zh from './zh.json';

const translations: Record<string, typeof en> = { en, zh };

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'zh';
}

export function useTranslations(lang: string) {
  return translations[lang] || translations.zh;
}

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === 'zh') return path;
  return `/en${path}`;
}

export function getSwitchLangPath(url: URL): string {
  const lang = getLangFromUrl(url);
  const path = url.pathname;
  if (lang === 'en') {
    return path.replace(/^\/en/, '') || '/';
  }
  return `/en${path}`;
}
