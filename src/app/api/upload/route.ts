import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Cek apakah token tersedia
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Upload Error Details:", error);
    return NextResponse.json({ 
      error: "Upload Failed", 
      details: error.message 
    }, { status: 500 });
  }
}
