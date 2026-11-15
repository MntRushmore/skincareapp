import { storeUpload } from "@/app/api/utils/upload";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") {
        return Response.json({ error: "file is required" }, { status: 400 });
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const stored = await storeUpload({
        bytes,
        filename: file.name,
        mimeType: file.type || null,
      });
      return Response.json(stored);
    }

    if (contentType.includes("application/octet-stream")) {
      const bytes = new Uint8Array(await request.arrayBuffer());
      const stored = await storeUpload({
        bytes,
        filename: "upload",
        mimeType: null,
      });
      return Response.json(stored);
    }

    const body = await request.json();
    if (body?.url) {
      return Response.json(await storeUpload({ url: body.url }));
    }
    if (body?.base64) {
      return Response.json(
        await storeUpload({ base64: body.base64, mimeType: body.mimeType }),
      );
    }

    return Response.json(
      { error: "Provide a file, base64, or url" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Upload] failed:", error);
    return Response.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
