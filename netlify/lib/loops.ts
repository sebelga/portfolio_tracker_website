import { LoopsClient, APIError } from "loops";

const PRODUCT_UPDATE_MAILING_LIST_ID = "cmn4u84l20aqw0ixef0bpbick"; // Loops mailing list ID for product updates

/**
 * Adds a contact to the Loops audience.
 * If the contact already exists, we treat that as success.
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

  const loops = new LoopsClient(apiKey);
  const mailingLists = {
    [PRODUCT_UPDATE_MAILING_LIST_ID]: true,
  };

  try {
    await loops.createContact({
      email,
      properties: {
        source,
        ...(licenseLevel != null && { license: licenseLevel }),
      },
      mailingLists,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 409) {
      return { success: true, alreadyExists: true };
    }
    if (error instanceof APIError) {
      console.error(
        `Loops API error (${error.statusCode}):`,
        error.json ?? error.rawBody,
      );
    } else {
      console.error("Loops unexpected error:", error);
    }
    return { success: false };
  }
}
