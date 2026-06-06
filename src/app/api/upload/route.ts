import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    // 1. Cek apakah token tersedia
    if (!token) {
      console.error("Vercel Blob Token is missing!");
      return NextResponse.json({ 
        error: "Configuration Error", 
        details: "BLOB_READ_WRITE_TOKEN is not set in Vercel environment variables." 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Cek ukuran file (Batas Vercel Hobby adalah 4.5MB)
    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File too large", 
        details: "File size exceeds 4.5MB limit." 
      }, { status: 400 });
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    // 3. Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: token // Pastikan token dioper secara eksplisit
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Upload Error Details:", error);
    return NextResponse.json({ 
      error: "Upload Failed", 
      details: error.message || "Unknown error occurred during upload"
    }, { status: 500 });
  }
}
