"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleLogo,
  MicrosoftOutlookLogo,
  EnvelopeSimple,
  Copy,
  Check,
} from "@phosphor-icons/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { WEB3FORMS_ACCESS_KEY } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Draft = { subject: string; body: string };

/**
 * Site statik (sunucu yok). Mesaj Web3Forms ile doğrudan stüdyoya
 * gönderiliyor (anahtar: src/data/site.ts). Mailin "yanıtla" adresi
 * ziyaretçinin e-postası; doğrudan cevap verilebiliyor.
 *
 * Yedek akış: anahtar tanımlı değilse ya da gönderim başarısız olursa
 * (bağlantı, servis) mesaj hazırlanıp seçenekler çıkıyor: Gmail ve
 * Outlook'un web yazma sayfaları (alıcı, konu, metin dolu), e-posta
 * uygulaması ve kopyalama. Yalnızca mailto: olsaydı Windows'ta çoğu
 * kişide hiçbir şey açılmazdı.
 *
 * Spam: botların doldurduğu gizli "botcheck" alanı (Web3Forms bunu tanıyor).
 */
export function ContactForm({ dict }: { dict: Dictionary }) {
  const t = dict.contactPage.form;
  const to = dict.footer.email;
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const direct = WEB3FORMS_ACCESS_KEY.length > 0;
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Seçenekler çıkınca oraya kaydır ve odağı başlığa ver (ekran okuyucu da duysun)
  useEffect(() => {
    if (!draft) return;
    const panel = panelRef.current;
    panel?.scrollIntoView({ block: "center" });
    panel?.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });
  }, [draft]);

  // Gönderildi: onay mesajına odaklan
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
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

    const mailSubject = `${subject || dict.meta.siteName}: ${name}`;
    const body = [`${t.bodyName}: ${name}`, `${t.email}: ${email}`, "", message].join("\n");
    setCopied(false);

    if (!direct) {
      setDraft({ subject: mailSubject, body });
      return;
    }

    // Tuzak alan işaretliyse bot: göndermeden başarılı gibi davran
    if (data.get("botcheck")) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setDraft(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Divonia Studios web sitesi · ${mailSubject}`,
          from_name: "Divonia Studios web sitesi",
          name,
          email,
          topic: subject,
          message,
        }),
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !result?.success) throw new Error("send failed");
      setStatus("sent");
      formRef.current?.reset();
    } catch {
      // Mesaj kaybolmasın: hazırlayıp yedek seçenekleri göster
      setStatus("error");
      setDraft({ subject: mailSubject, body });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const enc = encodeURIComponent;
  const links = draft
    ? {
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(draft.subject)}&body=${enc(draft.body)}`,
        outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(to)}&subject=${enc(draft.subject)}&body=${enc(draft.body)}`,
        app: `mailto:${to}?subject=${enc(draft.subject)}&body=${enc(draft.body)}`,
      }
    : null;

  async function copyMessage() {
    if (!draft) return;
    const text = `${t.toLabel}: ${to}\n${t.subjectLabel}: ${draft.subject}\n\n${draft.body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Eski tarayıcı ya da izin yok: görünmez bir alan üzerinden kopyala
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  const field =
    "px-notch w-full bg-panel px-4 py-3.5 text-base text-ink placeholder:text-faint shadow-[inset_0_0_0_1px_var(--line-strong)] transition-shadow outline-none focus:shadow-[inset_0_0_0_2px_var(--accent-text)]";

  return (
    // Form değişirse hazırlanan mesaj eskir; seçenekler kapanıyor
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={() => {
        if (draft) setDraft(null);
        if (status === "error") setStatus("idle");
      }}
      noValidate
    >
      {status === "sent" && (
        <div
          ref={sentRef}
          tabIndex={-1}
          role="status"
          className="px-notch px-box mb-8 p-6 outline-none sm:p-8"
          style={{ ["--px-border" as string]: "var(--accent)" }}
        >
          <p className="font-display flex items-center gap-2 text-xl font-bold">
            <Check size={22} weight="bold" className="text-accent-text" aria-hidden />
            {t.sentTitle}
          </p>
          <p className="text-muted mt-2 text-sm leading-relaxed">{t.sentText}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-display text-ink mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline decoration-2 underline-offset-4"
          >
            {t.sendAnother}
          </button>
        </div>
      )}

      {/* Spam tuzağı: insanlar görmüyor, botlar dolduruyor */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

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
              <span className="px-notch bg-panel text-muted peer-checked:bg-accent-fill peer-focus-visible:outline-accent-text hud inline-flex min-h-11 items-center px-4 !text-[0.85rem] !normal-case !tracking-normal shadow-[inset_0_0_0_1px_var(--line-strong)] transition-colors peer-checked:text-white peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 hover:text-ink">
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
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="btn-px btn-primary self-start disabled:cursor-wait disabled:opacity-70"
        >
          <span className="px-notch px-box">{status === "sending" ? t.sending : t.submit}</span>
        </button>
        {!draft && (
          <p className="text-faint text-sm">
            {direct ? (
              <>
                {t.noteDirect} {t.privacy}
              </>
            ) : (
              t.note
            )}
          </p>
        )}
      </div>

      {draft && links && (
        <div
          ref={panelRef}
          className="px-notch px-box mt-8 p-6 sm:p-8"
          style={{ ["--px-border" as string]: "var(--accent)" }}
          aria-live="polite"
        >
          {status === "error" && (
            <p role="alert" className="text-accent-text mb-3 text-sm font-medium">
              {t.sendError}
            </p>
          )}
          <p data-focus tabIndex={-1} className="font-display text-xl font-bold outline-none">
            {t.readyTitle}
          </p>
          <p className="text-muted mt-2 text-sm leading-relaxed">{t.readyText}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={links.gmail} target="_blank" rel="noopener noreferrer" className="btn-px btn-ghost btn-sm">
              <span className="px-notch px-box w-full">
                <GoogleLogo size={18} weight="bold" aria-hidden />
                {t.viaGmail}
                <span className="sr-only">({dict.common.opensNewTab})</span>
              </span>
            </a>
            <a href={links.outlook} target="_blank" rel="noopener noreferrer" className="btn-px btn-ghost btn-sm">
              <span className="px-notch px-box w-full">
                <MicrosoftOutlookLogo size={18} weight="bold" aria-hidden />
                {t.viaOutlook}
                <span className="sr-only">({dict.common.opensNewTab})</span>
              </span>
            </a>
            <a href={links.app} className="btn-px btn-ghost btn-sm">
              <span className="px-notch px-box w-full">
                <EnvelopeSimple size={18} weight="bold" aria-hidden />
                {t.viaApp}
              </span>
            </a>
            <button type="button" onClick={copyMessage} className="btn-px btn-ghost btn-sm">
              <span className="px-notch px-box w-full">
                {copied ? <Check size={18} weight="bold" aria-hidden /> : <Copy size={18} weight="bold" aria-hidden />}
                {copied ? t.copied : t.copy}
              </span>
            </button>
          </div>

          <p className="text-faint mt-5 text-sm">
            {t.copyHint}{" "}
            <a href={`mailto:${to}`} className="link-px">
              {to}
            </a>
          </p>
        </div>
      )}
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
