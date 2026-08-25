/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SARVAM AI INTEGRATION POINT  ·  PLACEHOLDER — NOT YET CONNECTED
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This module is the single, clearly-marked integration point for Sarvam AI's
 * multilingual and voice APIs (translation, speech-to-text, text-to-speech).
 *
 * CURRENT STATE: SevaSetu is a hackathon prototype. NO Sarvam AI API key is
 * configured and NO calls are made to Sarvam endpoints. Every function below
 * is a typed stub that returns null, so the UI degrades gracefully to
 * English-only, text-only behaviour.
 *
 * TO INTEGRATE LATER:
 *   1. Store the Sarvam API key as a server-side secret: SARVAM_API_KEY
 *      (never expose it to the browser).
 *   2. Implement these stubs as TanStack server functions / server routes so
 *      the key stays server-side:
 *        - Translation   → https://api.sarvam.ai/translate
 *        - Speech-to-text → https://api.sarvam.ai/speech-to-text
 *        - Text-to-speech → https://api.sarvam.ai/text-to-speech
 *   3. Set SARVAM_INTEGRATION_ENABLED to true once wired.
 *
 * The AI Citizen Assistant (src/components/assistant-widget.tsx) already calls
 * these functions behind feature checks and falls back to scripted responses.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SARVAM_INTEGRATION_ENABLED = false;

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "mr", label: "मराठी (Marathi)" },
] as const;

export type SarvamLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

/**
 * Translate text into an Indian language via Sarvam AI.
 * PLACEHOLDER: returns null — caller must fall back to the source text.
 */
export async function translateText(
  text: string,
  _targetLanguage: SarvamLanguageCode,
): Promise<string | null> {
  if (!SARVAM_INTEGRATION_ENABLED) return null;
  // TODO(sarvam): call Sarvam translate API via a server function with SARVAM_API_KEY.
  void text;
  return null;
}

/**
 * Transcribe citizen voice input (for voice-assisted navigation / low
 * digital-literacy users). PLACEHOLDER: returns null — mic stays disabled.
 */
export async function speechToText(_audio: Blob): Promise<string | null> {
  if (!SARVAM_INTEGRATION_ENABLED) return null;
  // TODO(sarvam): call Sarvam speech-to-text API via a server function.
  return null;
}

/**
 * Synthesise speech for read-aloud assistance.
 * PLACEHOLDER: returns null — read-aloud stays disabled.
 */
export async function textToSpeech(
  text: string,
  _language: SarvamLanguageCode,
): Promise<string | null> {
  if (!SARVAM_INTEGRATION_ENABLED) return null;
  // TODO(sarvam): call Sarvam text-to-speech API, return an audio URL.
  void text;
  return null;
}
