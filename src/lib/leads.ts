/**
 * Lead capture — every public form on the site posts here.
 *
 * One destination: a GoHighLevel *Inbound Webhook*. The GHL workflow behind that URL
 * is what fans the submission out — Create/Update Contact, then a Google Sheets
 * "Create Row" action. Adding a destination is a workflow change in GHL, not a code
 * change here.
 *
 * The webhook URL ships in the client bundle. That is acceptable for an inbound
 * webhook: it accepts writes only and exposes no data. A GHL *API key* would not be
 * safe here and must never be added to a VITE_ variable.
 */

const WEBHOOK_URL = (import.meta as any).env?.VITE_GHL_WEBHOOK_URL as string | undefined;

/** Give up rather than leave the user staring at a spinner if GHL is slow. */
const TIMEOUT_MS = 15000;

/** Identifies which form a submission came from, so one webhook can serve all three. */
export type LeadSource = 'contact' | 'schedule-visit' | 'partner';

export type LeadFields = Record<string, string>;

/**
 * Send a submission to GHL.
 *
 * Resolves when the webhook has accepted it, throws a message safe to show the user
 * otherwise. Field names are sent as-is and become the mappable fields in the GHL
 * workflow, so renaming a key here means re-mapping the workflow action.
 */
export async function submitLead(source: LeadSource, fields: LeadFields): Promise<void> {
  if (!WEBHOOK_URL) {
    console.error('VITE_GHL_WEBHOOK_URL is not set — the form has nowhere to submit to.');
    throw new Error('This form is not configured yet. Please call or email us instead.');
  }

  const body = JSON.stringify({
    source,
    submittedAt: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    ...fields,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('GHL webhook rejected the submission:', response.status, await response.text());
      throw new Error('We could not send your message right now. Please try again in a moment.');
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The request timed out. Please check your connection and try again.');
    }

    // A TypeError from fetch means the browser blocked the *response*, not the request —
    // typically a missing CORS header on the webhook. Re-send it as an opaque no-cors
    // request, which GHL still receives, and treat delivery as success. We lose error
    // detection on this path, which is why the cors attempt is made first.
    if (error instanceof TypeError) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        // text/plain keeps this a "simple" request so no preflight is needed.
        headers: { 'Content-Type': 'text/plain' },
        body,
      });
      return;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
