export const HOME_SECTION_INTENT_KEY = "rolandwayne:home-section";

export function rememberHomeSection(sectionId) {
  try {
    window.sessionStorage.setItem(HOME_SECTION_INTENT_KEY, sectionId);
  } catch {
    // Navigation still reaches the homepage when storage is unavailable.
  }
}

export function consumeHomeSection() {
  try {
    const sectionId = window.sessionStorage.getItem(HOME_SECTION_INTENT_KEY);
    window.sessionStorage.removeItem(HOME_SECTION_INTENT_KEY);
    return sectionId;
  } catch {
    return null;
  }
}
