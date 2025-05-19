export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // For now, we'll just log it (you can integrate with SendGrid, Resend, etc.)
    console.log('📬 New Contact Form Submission:', { name, email, message });

    // You can send an email here using an email service

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
