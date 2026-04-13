import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Convert the file to a base64 string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString("base64");

    // 2. Prepare the data for ImageKit
    const imageKitData = new FormData();
    imageKitData.append("file", base64File);
    imageKitData.append("fileName", file.name);

    // 3. Authenticate using your Private Key
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
    const authHeader = `Basic ${Buffer.from(privateKey + ":").toString("base64")}`;

    // 4. Send the upload request to ImageKit's REST API
    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: imageKitData as any,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(uploadData.message || "Failed to upload image to ImageKit");
    }

    // Return the secure URL back to the frontend
    return NextResponse.json({ url: uploadData.url });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}