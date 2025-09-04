 
import { ObjectId } from "mongodb";
 
import connectToDatabase from "@/app/lib/mongodb";
import { withCorsHeaders } from "@/app/lib/cors";

// DELETE → delete a single item inside a post
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const index = parseInt(searchParams.get("index"), 10);

    if (!postId || isNaN(index)) {
      return new Response(JSON.stringify({ error: "PostId and index are required" }), { status: 400 });
    }

    const db = await connectToDatabase();
    const postsCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    const updatedItems = post.items.filter((_, i) => i !== index);

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { items: updatedItems } }
    );

    return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), { status: 500 });
  }
}

// PUT → update title or labels of items
export async function PUT(req) {
  try {
    const { postId, title,text, items } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: "PostId is required" }), { status: 400 });
    }

    const db = await connectToDatabase();
    const postsCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (items !== undefined) updateFields.items = items;
    if (text !== undefined) updateFields.text = text;

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updateFields }
    );

    return new Response(JSON.stringify({ message: "Post updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }
}
