"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Site statik olduğu için form, ziyaretçinin e-posta uygulamasında hazır
 * bir mesaj açar. Gerçek gönderim istenirse (Formspree vb.) handleSubmit
 * içi değiştirilir.
 */
export function ContactForm({ dict }: { dict: Dictionary }) {
  const t = dict.contactPage.form;
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = t.required;
    if (!email) next.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.invalidEmail;
    if (!message) next.message = t.required;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // İlk hatalı alana git; sabit üst menünün altında kalmasın diye ortala
      const first = document.getElementById(Object.keys(next)[0]);
      first?.focus({ preventScroll: true });
      first?.scrollIntoView({ block: "center" });
      return;
    }

    const body = [`${t.name}: ${name}`, `${t.email}: ${email}`, "", message].join("\n");
    window.location.href = `mailto:${dict.footer.email}?subject=${encodeURIComponent(
      `${subject || dict.meta.siteName}: ${name}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  const field =
    "px-notch w-full bg-panel px-4 py-3.5 text-base text-ink placeholder:text-faint shadow-[inset_0_0_0_1px_var(--line-strong)] transition-shadow outline-none focus:shadow-[inset_0_0_0_2px_var(--accent-text)]";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t.name} htmlFor="name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <Field label={t.email} htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>
      </div>

      {/* Konu: native <select> yerine seçim ızgarası; her yerde aynı görünüyor
          ve ok tuşlarıyla gezilebiliyor. */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-medium">{t.subject}</legend>
        <div className="flex flex-wrap gap-2.5">
          {t.subjects.map((subject, index) => (
            <label key={subject} className="cursor-pointer">
              <input
                type="radio"
                name="subject"
                value={subject}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="px-notch bg-panel text-muted peer-checked:bg-accent-fill peer-focus-visible:outline-accent-text hud inline-block px-4 py-3 !text-[0.85rem] !normal-case !tracking-normal shadow-[inset_0_0_0_1px_var(--line-strong)] transition-colors peer-checked:text-white peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 hover:text-ink">
                {subject}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8">
        <Field label={t.message} htmlFor="message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder={t.messagePlaceholder}
            className={`${field} resize-y`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" className="btn-px btn-primary self-start">
          <span className="px-notch px-box">{t.submit}</span>
        </button>
        <p className="text-faint text-sm">{t.note}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-accent-text text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
