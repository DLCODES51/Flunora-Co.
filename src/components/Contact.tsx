"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Instagram, Mail, MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { HeartDoodle, Sparkle } from "./Doodles";
import { submitContactMessage } from "@/functions/content";

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(4, "Add a short note").max(800),
});

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const submitFn = useServerFn(submitContactMessage);
  const instagramUrl = "https://instagram.com/co.flunora";
  const emailAddress = "flunora.co@gmail.com";
  const whatsappNumber = "918200217521";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      setStatus("error");
      return;
    }
    setError(null);
    try {
      await submitFn({ data: parsed.data });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--sky)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <span className="script text-2xl text-pink-deep">say hi!</span>
          <h2 className="display text-balance text-5xl font-bold leading-[0.95] md:text-7xl">
            Let's make something
            <br />
            cute together <Sparkle className="inline-block align-middle" color="#EC8DB1" size={36} />
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <div className="flex flex-col gap-5">
            {[
              { Icon: Instagram, label: "@co.flunora", sub: "DMs always open", href: instagramUrl, bg: "var(--pink)" },
              { Icon: Mail, label: emailAddress, sub: "Drop a sweet email", href: `mailto:${emailAddress}`, bg: "var(--butter)" },
              { Icon: MessageCircle, label: "WhatsApp us", sub: "+91 8200217521", href: `https://wa.me/${whatsappNumber}`, bg: "var(--mint)" },
            ].map(({ Icon, label, sub, href, bg }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, rotate: -0.6 }}
                className="flex items-center gap-4 rounded-3xl p-5"
                style={{ background: bg, border: "1.5px solid #111", boxShadow: "6px 6px 0 #111" }}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-cream"
                  style={{ border: "1.5px solid #111" }}
                >
                  <Icon className="h-6 w-6 text-ink" />
                </span>
                <div>
                  <p className="display text-xl font-bold text-ink">{label}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                    {sub}
                  </p>
                </div>
              </motion.a>
            ))}

            <div
              className="mt-2 flex aspect-[16/9] items-center justify-center rounded-3xl bg-cream text-xs font-semibold uppercase tracking-[0.3em] text-ink/60"
              style={{ border: "1.5px solid #111", boxShadow: "6px 6px 0 #111" }}
            >
              Map · Coming soon
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full self-start rounded-[36px] bg-cream p-7 md:p-10"
            style={{ border: "1.5px solid #111", boxShadow: "8px 8px 0 #111" }}
          >
            <div className="space-y-5">
              <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-ink">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 w-full resize-none rounded-2xl bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/50 focus:outline-none"
                  placeholder="Tell us what you're dreaming up…"
                  style={{ border: "1.5px solid #111" }}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {status === "sent" && (
                <p className="flex items-center gap-2 text-sm font-semibold text-pink-deep">
                  <HeartDoodle size={16} /> Thank you — we'll write back soon!
                </p>
              )}

              <motion.button
                type="submit"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white"
                style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 #F5B3CB" }}
              >
                Send Note <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-[0.2em] text-ink">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/50 focus:outline-none"
        style={{ border: "1.5px solid #111" }}
      />
    </div>
  );
}