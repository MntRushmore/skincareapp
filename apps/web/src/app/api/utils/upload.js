import { createHmac } from "node:crypto";

function dataUrlFromBase64(base64, mimeType) {
  if (typeof base64 === "string" && base64.startsWith("data:")) {
    const match = /^data:([^;]+);base64,/.exec(base64);
    return { url: base64, mimeType: match?.[1] || mimeType || null };
  }
  const type = mimeType || "application/octet-stream";
  return { url: `data:${type};base64,${base64}`, mimeType: type };
}

function uploadcareSignature(secret) {
  const expire = String(Math.floor(Date.now() / 1000) + 30 * 60);
  const signature = createHmac("sha256", secret).update(expire).digest("hex");
  return { expire, signature };
}

function appendUploadcareAuth(form) {
  form.append("UPLOADCARE_PUB_KEY", process.env.UPLOADCARE_PUBLIC_KEY);
  form.append("UPLOADCARE_STORE", "auto");
  if (process.env.UPLOADCARE_SECRET_KEY) {
    const { expire, signature } = uploadcareSignature(
      process.env.UPLOADCARE_SECRET_KEY,
    );
    form.append("UPLOADCARE_EXPIRE", expire);
    form.append("UPLOADCARE_SIGNATURE", signature);
  }
}

async function uploadBytesToUploadcare({ bytes, filename, mimeType }) {
  const form = new FormData();
  appendUploadcareAuth(form);
  const blob = new Blob([bytes], {
    type: mimeType || "application/octet-stream",
  });
  form.append("file", blob, filename || "upload");

  const response = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.file) {
    throw new Error(
      data?.error?.content ||
        data?.detail ||
        `Uploadcare upload failed (${response.status})`,
    );
  }
  return {
    url: `https://ucarecdn.com/${data.file}/`,
    mimeType: mimeType || null,
  };
}

async function uploadUrlToUploadcare(url) {
  const form = new FormData();
  appendUploadcareAuth(form);
  form.set("UPLOADCARE_STORE", "1");
  form.append("pub_key", process.env.UPLOADCARE_PUBLIC_KEY);
  form.append("source_url", url);
  form.append("store", "1");

  const response = await fetch("https://upload.uploadcare.com/from_url/", {
    method: "POST",
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.error?.content ||
        data?.detail ||
        `Uploadcare from_url failed (${response.status})`,
    );
  }

  const token = data.token;
  if (data.file_id) {
    return {
      url: `https://ucarecdn.com/${data.file_id}/`,
      mimeType: data.type || null,
    };
  }
  if (!token) {
    throw new Error("Uploadcare did not return a file id");
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const statusResponse = await fetch(
      `https://upload.uploadcare.com/from_url/status/?token=${encodeURIComponent(token)}`,
    );
    const status = await statusResponse.json();
    if (status.status === "success" && status.file_id) {
      return {
        url: `https://ucarecdn.com/${status.file_id}/`,
        mimeType: status.type || null,
      };
    }
    if (status.status === "error") {
      throw new Error(status.error || "Uploadcare could not fetch that URL");
    }
  }
  throw new Error("Uploadcare timed out while fetching that URL");
}

/**
 * Stores an upload on Uploadcare when UPLOADCARE_PUBLIC_KEY is set.
 * Without that key, base64 payloads are returned as data URLs and remote
 * URLs are returned unchanged so the app still runs.
 */
export async function storeUpload({ url, base64, bytes, filename, mimeType }) {
  const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;

  if (bytes) {
    if (publicKey) {
      return uploadBytesToUploadcare({ bytes, filename, mimeType });
    }
    const encoded = Buffer.from(bytes).toString("base64");
    return dataUrlFromBase64(encoded, mimeType);
  }

  if (base64) {
    const parsed = dataUrlFromBase64(base64, mimeType);
    if (publicKey) {
      const comma = parsed.url.indexOf(",");
      const payload = comma >= 0 ? parsed.url.slice(comma + 1) : parsed.url;
      const raw = Buffer.from(payload, "base64");
      return uploadBytesToUploadcare({
        bytes: raw,
        filename: filename || "upload",
        mimeType: parsed.mimeType,
      });
    }
    return parsed;
  }

  if (url) {
    if (publicKey && !url.startsWith("data:")) {
      return uploadUrlToUploadcare(url);
    }
    return { url, mimeType: mimeType || null };
  }

  throw new Error("Nothing to upload");
}

export default storeUpload;
