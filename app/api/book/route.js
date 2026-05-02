export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const bookingId = `VRD-${Date.now().toString().slice(-8)}`;

  return Response.json({
    ok: true,
    bookingId,
    received: {
      reddit: body.reddit || null,
      plan: body.plan || null,
      amount: body.amount || null
    }
  });
}
