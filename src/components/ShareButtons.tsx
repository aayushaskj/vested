"use client";

import { useEffect, useState } from "react";

interface ShareButtonsProps {
  /** Full URL to share. If omitted, uses current window.location.href. */
  url?: string;
  /** Title to share. */
  title: string;
  /** Optional supporting text (used by Web Share API and Twitter). */
  description?: string;
  /** Visual layout: 'inline' for in-flow rows, 'sticky' for floating sidebar (desktop only). */
  variant?: "inline" | "compact";
}

/**
 * Privacy-friendly share buttons. No third-party iframes or trackers.
 * - Mobile: shows native Web Share API button + Copy.
 * - Desktop: shows X / LinkedIn / WhatsApp / Copy.
 */
export function ShareButtons({
  url,
  title,
  description,
  variant = "inline",
}: ShareButtonsProps) {
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setResolvedUrl(window.location.href);
    }
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, [url]);

  const encUrl = encodeURIComponent(resolvedUrl || "https://vested.blog");
  const encTitle = encodeURIComponent(title);
  const encText = encodeURIComponent(
    description ? `${title} — ${description}` : title
  );

  const twitterHref = `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
  const whatsappHref = `https://wa.me/?text=${encText}%20${encUrl}`;

  async function handleNativeShare() {
    try {
      await navigator.share({
        title,
        text: description ?? title,
        url: resolvedUrl,
      });
    } catch {
      // user cancelled — ignore
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  const btnBase =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-xs font-medium text-ink-700 hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100";

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5">
        {canNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            className={btnBase}
            aria-label="Share"
          >
            <ShareIcon className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        ) : (
          <>
            <a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              className={btnBase}
              aria-label="Share on X"
            >
              <XIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className={btnBase}
              aria-label="Share on LinkedIn"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
            </a>
          </>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={btnBase}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-accent-600" />
          ) : (
            <LinkIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-ink-500">Share:</span>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className={btnBase}
          aria-label="Share via your device"
        >
          <ShareIcon className="h-3.5 w-3.5" />
          <span>Share</span>
        </button>
      )}
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        <XIcon className="h-3.5 w-3.5" />
        <span>X</span>
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
        <span>LinkedIn</span>
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
        <span>WhatsApp</span>
      </a>
      <button type="button" onClick={handleCopy} className={btnBase}>
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5 text-accent-600" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Copy link</span>
          </>
        )}
      </button>
    </div>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4v12m0-12L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12l5 5 9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
