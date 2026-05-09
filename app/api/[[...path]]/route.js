import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERCEL_DEFAULT_BACKEND = "https://e-commerce-restylefashion-3325.vercel.app";
const LOCAL_BACKEND = "http://127.0.0.1:5001";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

function backendOrigin() {
  const fromEnv = process.env.BACKEND_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL === "1") return VERCEL_DEFAULT_BACKEND;
  return LOCAL_BACKEND;
}

async function proxy(request, context) {
  const { path: segments = [] } = await context.params;
  const parts = Array.isArray(segments) ? segments : [];
  const sub = parts.length ? parts.map(encodeURIComponent).join("/") : "";
  const upstreamPath = sub ? `api/${sub}` : "api";
  const target = `${backendOrigin()}/${upstreamPath}${request.nextUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  let body;
  if (!["GET", "HEAD"].includes(request.method)) {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err) {
    console.error("[api proxy]", target, err);
    return NextResponse.json({ message: "API upstream unreachable" }, { status: 502 });
  }

  const responseHeaders = new Headers(upstream.headers);
  const contentType = upstream.headers.get("content-type");

  const buf = Buffer.from(await upstream.arrayBuffer());

  return new NextResponse(buf, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
