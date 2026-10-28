export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      return Response.json({ reply: "خطأ: البايندنغ AI مش واصل للوسيط. ارفع الموقع من جديد بعد إضافته." }, { status: 500 });
    }

    const body = await request.json();
    const messages = (body.messages || []).slice(-8).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 500)
    }));
    if (!messages.length || messages[0].role !== "user") {
      return Response.json({ reply: "اكتب سؤالك أول." }, { status: 400 });
    }

    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد موقع Abd Code. جاوب بالعربي (لهجة بسيطة) وباختصار. " +
            "بتساعد الزوار بأسئلة HTML وCSS وJavaScript. " +
            "إذا السؤال بعيد عن البرمجة، اعتذر بلطف وارجع للموضوع."
        },
        ...messages
      ]
    });

    const reply = result.response ?? result.choices?.[0]?.message?.content;
    if (!reply) return Response.json({ reply: "صار خطأ: الرد فاضي." }, { status: 500 });
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ reply: "صار خطأ: " + (e && e.message ? e.message : String(e)) }, { status: 500 });
  }
}
