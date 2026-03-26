import { initFirebase } from "../lib/firebase";
import { MAX_PREMIUM_LICENSES } from "../../constants.mjs";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const db = initFirebase();
    const countersDoc = await db
      .collection("metadata")
      .doc("license-counts")
      .get();

    let premiumCount = 0;
    if (countersDoc.exists) {
      premiumCount = countersDoc.data()?.premium ?? 0;
    }

    const remaining = Math.max(0, MAX_PREMIUM_LICENSES - premiumCount);

    return Response.json(
      { remaining, total: MAX_PREMIUM_LICENSES },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching license stats:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
