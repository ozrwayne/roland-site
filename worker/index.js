const LOCAL_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";
const MAX_LENGTHS = {
  name: 80,
  company: 120,
  email: 160,
  projectStage: 80,
  budget: 80,
  brief: 4000,
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
});

const readField = (formData, name) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  "\"": "&quot;",
})[character] ?? character);

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isLocalHost = (hostname) => ["localhost", "127.0.0.1", "::1"].includes(hostname);

async function verifyTurnstile({ token, secret, ip }) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: ip || undefined,
      idempotency_key: crypto.randomUUID(),
    }),
  });

  if (!response.ok) return { success: false, "error-codes": ["siteverify-unavailable"] };
  return response.json();
}

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json({ success: false, message: "Method not allowed." }, 405);
  }

  const url = new URL(request.url);
  const localRequest = isLocalHost(url.hostname);
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, message: "提交格式无效，请刷新页面后重试。" }, 400);
  }

  if (readField(formData, "website")) {
    return json({ success: true, message: "信息已发送。" });
  }

  const fields = {
    name: readField(formData, "name"),
    company: readField(formData, "company"),
    email: readField(formData, "email"),
    projectStage: readField(formData, "projectStage"),
    budget: readField(formData, "budget"),
    brief: readField(formData, "brief"),
  };
  const turnstileToken = readField(formData, "cf-turnstile-response");

  if (Object.values(fields).some((value) => !value)) {
    return json({ success: false, message: "请填写所有必填项目。" }, 400);
  }
  if (!isValidEmail(fields.email)) {
    return json({ success: false, message: "请输入有效的邮箱地址。" }, 400);
  }
  if (Object.entries(fields).some(([name, value]) => value.length > MAX_LENGTHS[name])) {
    return json({ success: false, message: "部分内容过长，请精简后再发送。" }, 400);
  }
  if (!turnstileToken) {
    return json({ success: false, message: "请先完成人机验证。" }, 400);
  }

  const turnstileSecret = env.TURNSTILE_SECRET_KEY || (localRequest ? LOCAL_TURNSTILE_SECRET : "");
  if (!turnstileSecret) {
    return json({ success: false, message: "联系表单暂时不可用，请直接发送邮件。" }, 503);
  }

  let turnstileResult;
  try {
    turnstileResult = await verifyTurnstile({
      token: turnstileToken,
      secret: turnstileSecret,
      ip: request.headers.get("CF-Connecting-IP") ?? "",
    });
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return json({ success: false, message: "验证服务暂时不可用，请稍后重试。" }, 503);
  }

  const expectedHostnames = new Set(["rolandwayne.com", "www.rolandwayne.com"]);
  const hostnameMatches = localRequest
    || (turnstileResult.hostname ? expectedHostnames.has(turnstileResult.hostname) : false);
  const actionMatches = localRequest || turnstileResult.action === "contact";

  if (!turnstileResult.success || !hostnameMatches || !actionMatches) {
    return json({ success: false, message: "人机验证未通过，请重新验证后发送。" }, 400);
  }

  if (localRequest && (!env.CONTACT_EMAIL || !env.CONTACT_TO_EMAIL)) {
    return json({ success: true, message: "本地测试提交成功，未发送真实邮件。" });
  }
  if (!env.CONTACT_EMAIL || !env.CONTACT_TO_EMAIL) {
    return json({ success: false, message: "联系表单暂时不可用，请直接发送邮件。" }, 503);
  }

  const safe = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const fromEmail = env.CONTACT_FROM_EMAIL || "website@rolandwayne.com";
  const subject = `[网站联系] ${fields.name} · ${fields.company}`.slice(0, 180);
  const text = [
    `姓名：${fields.name}`,
    `机构 / 公司：${fields.company}`,
    `邮箱：${fields.email}`,
    `合作阶段：${fields.projectStage}`,
    `预算范围：${fields.budget}`,
    "",
    "需求简述：",
    fields.brief,
  ].join("\n");
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#10295f;line-height:1.7;max-width:680px;margin:0 auto">
      <h1 style="font-size:24px;margin:0 0 24px">Roland Wayne 网站联系表单</h1>
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:10px;border:1px solid #d6e1ee;color:#647990;width:130px">姓名</td><td style="padding:10px;border:1px solid #d6e1ee">${safe.name}</td></tr>
        <tr><td style="padding:10px;border:1px solid #d6e1ee;color:#647990">机构 / 公司</td><td style="padding:10px;border:1px solid #d6e1ee">${safe.company}</td></tr>
        <tr><td style="padding:10px;border:1px solid #d6e1ee;color:#647990">邮箱</td><td style="padding:10px;border:1px solid #d6e1ee">${safe.email}</td></tr>
        <tr><td style="padding:10px;border:1px solid #d6e1ee;color:#647990">合作阶段</td><td style="padding:10px;border:1px solid #d6e1ee">${safe.projectStage}</td></tr>
        <tr><td style="padding:10px;border:1px solid #d6e1ee;color:#647990">预算范围</td><td style="padding:10px;border:1px solid #d6e1ee">${safe.budget}</td></tr>
      </table>
      <h2 style="font-size:16px;margin:28px 0 8px">需求简述</h2>
      <div style="padding:18px;border:1px solid #d6e1ee;background:#f7f9fc;white-space:pre-wrap">${safe.brief}</div>
    </div>
  `;

  try {
    await env.CONTACT_EMAIL.send({
      to: env.CONTACT_TO_EMAIL,
      from: { email: fromEmail, name: "Roland Wayne Website" },
      subject,
      text,
      html,
      replyTo: { email: fields.email, name: fields.name },
    });
  } catch (error) {
    console.error("Contact email failed", error?.code ?? "unknown", error?.message ?? error);
    const status = error?.code === "E_RATE_LIMIT_EXCEEDED" ? 429 : 502;
    return json({
      success: false,
      message: status === 429
        ? "发送次数过多，请稍后再试。"
        : "邮件暂时未能发送，请稍后重试或直接发送邮件。",
    }, status);
  }

  return json({ success: true, message: "信息已发送，我会尽快回复。" });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    if (url.pathname.startsWith("/api/")) {
      return json({ success: false, message: "Not found." }, 404);
    }
    return env.ASSETS.fetch(request);
  },
};
