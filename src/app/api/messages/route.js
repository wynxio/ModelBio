import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const messagesCollection = db.collection(process.env.NEXT_PUBLIC_Messages);

    // Check if ID is provided in query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data;
    if (id) {
      // Get a single message by ID
      if (!ObjectId.isValid(id)) {
        return withCorsHeaders(
          new Response(
            JSON.stringify({
              success: false,
              error: "Invalid message ID",
              data: null,
            }),
            { status: 400 }
          )
        );
      }
      data = await messagesCollection.findOne({ _id: new ObjectId(id) });
    } else {
      // Get all messages
      data = await messagesCollection.find({}).toArray();
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null, data }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error("API error (GET messages):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch messages",
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
    const messagesCollection = db.collection(process.env.NEXT_PUBLIC_Messages);

    const body = await req.json();
    const { name, email, phone, messagetext } = body;

    // Validate mandatory fields
    if (!name || !messagetext) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({
            success: false,
            error: "Missing required fields: name or messagetext",
          }),
          { status: 400 }
        )
      );
    }

    const insertData = {
      name,
      email: email || "",
      phone: phone || "",
      messagetext,
      createdAt: new Date(),
    };

    const result = await messagesCollection.insertOne(insertData);

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          error: null,
          data: { insertedId: result.insertedId },
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (POST messages):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Error saving message",
        }),
        { status: 500 }
      )
    );
  }
}
