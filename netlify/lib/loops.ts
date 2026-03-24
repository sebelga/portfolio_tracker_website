const LOOPS_API_URL = "https://app.loops.so/api/v1/contacts/create";
const PRODUCT_UPDATE_MAILING_LIST_ID = "cmn4u84l20aqw0ixef0bpbick"; // Loops mailing list ID for product updates

/**
 * Adds a contact to the Loops audience.
 * Uses the "create" endpoint which returns 409 if the contact already exists — we treat that as success.
 */
export async function addContactToLoops(
  email: string,
  source: string = "website",
  licenseLevel?: "beta-license" | "premium" | "free",
): Promise<{ success: boolean; alreadyExists?: boolean }> {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    console.warn("LOOPS_API_KEY not set — skipping Loops subscription.");
    return { success: false };
  }

  const response = await fetch(LOOPS_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      source,
      mailingLists: {
        [PRODUCT_UPDATE_MAILING_LIST_ID]: true,
      },
      license: licenseLevel,
    }),
  });

  if (response.ok) {
    return { success: true };
  }

  // 409 = contact already exists — treat as success
  if (response.status === 409) {
    return { success: true, alreadyExists: true };
  }

  const errorBody = await response.text();
  console.error(`Loops API error (${response.status}):`, errorBody);
  return { success: false };
}
