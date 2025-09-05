import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

// Directory where files will be saved
const uploadDir = path.join(process.cwd(), "public");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// GET all images
export async function GET() {
  try {
    const db = await connectToDatabase();
    const imageCollection = db.collection(process.env.NEXT_PUBLIC_GENERAL_FILES);

    const data = await imageCollection.find().toArray();

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null, data }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error("API error (GET images):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch images",
          data: [],
        }),
        { status: 500 }
      )
    );
  }
}

// POST new image (or replace existing one)
export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const imageCollection = db.collection(process.env.NEXT_PUBLIC_GENERAL_FILES);
   

    // if(existing){
    //   if (existing.imagePath) {
    //     const oldFilePath = path.join(uploadDir, existing.imagePath);
    //     if (fs.existsSync(oldFilePath)) {
    //       fs.unlinkSync(oldFilePath);
    //     }
    //   }
    // }
    // Parse multipart form data
    const formData = await req.formData();
    const type = formData.get("type"); // "profile" | "cover" | "welcome"
    const file = formData.get("file"); // file input

     const existing = await imageCollection?.findOne({ type });

    if (!file || !type) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Missing type or file" }),
          { status: 400 }
        )
      );
    }

    // Generate random filename

    //old
    //const ext = path.extname(file.name) || ".jpg";


    //new for jpg
    const ext =  ".jpg";


    //const randomName = randomUUID() + ext;
    const randomName = type + ext;
    //const randomName = type + ".jpg";
    const filePath = path.join(uploadDir, randomName);

    // Save file to disk
    const arrayBuffer = await file.arrayBuffer();


    //old
    //fs.writeFileSync(filePath, Buffer.from(arrayBuffer));




    //new
   // Convert file to JPG buffer
    const buffer = Buffer.from(arrayBuffer);
    const jpgBuffer = await sharp(buffer)
      .jpeg({ quality: 90 }) // adjust quality if needed
      .toBuffer();
    fs.writeFileSync(filePath, jpgBuffer);



    // Check if entry with same type exists
   

    if (existing) {
      // Delete old file
      

      // Update with new file
      await imageCollection.updateOne(
        { _id: new ObjectId(existing._id) },
        { $set: { imagePath: randomName, updatedAt: new Date() } }
      );
    } else {
      // Insert new
      await imageCollection.insertOne({
        type,
        imagePath: randomName,
        createdAt: new Date(),
      });
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null }), {
        status: 200,
      })
    );
  } catch (error) {
    console.error("API error (POST image):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Error saving image" }),
        { status: 500 }
      )
    );
  }
}
