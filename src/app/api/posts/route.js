 
import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
 
import { randomUUID } from "crypto";
import fs from "fs";
import { ObjectId } from "mongodb";
import path from "path";
 

// Utility for saving files in /public/uploads
async function saveFile(file) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(file.name) || "";
  const randomName = `${randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, randomName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${randomName}`;
}

// GET all posts
export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const posts = await postCollection.find().sort({ createdTime: -1 }).toArray();

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, posts }), { status: 200 })
    );
  } catch (err) {
    console.error("GET posts error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to fetch posts" }), { status: 500 })
    );
  }
}

// POST new post
export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type");

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const createdTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    if (contentType.includes("application/json")) {
      // Text post
      const { title, text } = await req.json();

      if (!title && !text) {
        return withCorsHeaders(
          new Response(JSON.stringify({ success: false, error: "Title and Text are required" }), {
            status: 400,
          })
        );
      }

      const result = await postCollection.insertOne({
        type: "text",
        title,
        text,
        createdTime,
      });

      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: true, message: "Text post created", insertedId: result.insertedId }),
          { status: 201 }
        )
      );
    }

    if (contentType.includes("multipart/form-data")) {
      // Photo/Video post
      const formData = await req.formData();
      const title = formData.get("title");
      const text = formData.get("text");
      const items = [];

      for (const [key, value] of formData.entries()) {
        if (key.startsWith("file-")) {
          const index = key.split("-")[1];
          const label = formData.get(`label-${index}`);
          const filePath = await saveFile(value);

          let fileType = "image";
          if (value.type.startsWith("video")) fileType = "video";
          else if (value.type.startsWith("audio")) fileType = "audio";

          items.push({ fileuploadedpath: filePath, label, filetype: fileType });
        }
      }

      if (items.length === 0) {
        return withCorsHeaders(
          new Response(JSON.stringify({ success: false, error: "at least one file required" }), {
            status: 400,
          })
        );
      }

      const result = await postCollection.insertOne({
        type: "media",
        title,
        text,
        items,
        createdTime,
      });

      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: true, message: "Media post created", insertedId: result.insertedId }),
          { status: 201 }
        )
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Unsupported content type" }), { status: 400 })
    );
  } catch (err) {
    console.error("POST posts error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to create post" }), { status: 500 })
    );
  }
}

export async function PUT(req) {
  try {
    const { id, title } = await req.json();

    if (!id || !title) {
      return new Response(JSON.stringify({ error: "ID and title are required" }), { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const updated = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );

    if (updated.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No post updated" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Post title updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return new Response(JSON.stringify({ error: "Failed to update post" }), { status: 500 });
  }
}

 

// Ensure Node runtime (needed for fs)
export const runtime = "nodejs";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing id" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Post not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, message: "Post deleted" }), { status: 200 })
    );
  } catch (err) {
    console.error("DELETE /api/posts error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to delete post" }), { status: 500 })
    );
  }
}