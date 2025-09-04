import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const aboutCollection = db.collection(process.env.NEXT_PUBLIC_About);

    const data = await aboutCollection.findOne({});
    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null, data }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error("API error (GET about):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch about info",
          data: null,
        }),
        { status: 500 }
      )
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const aboutCollection = db.collection(process.env.NEXT_PUBLIC_About);

    const body = await req.json();
    const { name, intro, instagram, facebook, twitter, youtube } = body;

    if (!name || !intro) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({
            success: false,
            error: "Missing name or intro",
          }),
          { status: 400 }
        )
      );
    }

    // Prepare update object
    const updateData = {
      name,
      intro,
      instagram: instagram || "",
      facebook: facebook || "",
      twitter: twitter || "",
      youtube: youtube || "",
      updatedAt: new Date(),
    };

    // Check if already exists
    const existing = await aboutCollection.findOne({});
    if (existing) {
      await aboutCollection.updateOne(
        { _id: existing._id },
        { $set: updateData }
      );
    } else {
      await aboutCollection.insertOne({
        ...updateData,
        createdAt: new Date(),
      });
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error("API error (POST about):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Error saving about info",
        }),
        { status: 500 }
      )
    );
  }
}
