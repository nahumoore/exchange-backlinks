const STRUCTURE = "stroke-muted-foreground/45"

/** Step 1 — a site card whose URL is redacted and locked. */
export function IllustrationSubmit() {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden="true"
      className="mx-auto h-auto w-full max-w-60"
    >
      {/* browser window */}
      <rect
        x="40"
        y="20"
        width="120"
        height="100"
        rx="8"
        strokeWidth="1.5"
        className={STRUCTURE}
      />
      <line
        x1="40"
        y1="44"
        x2="160"
        y2="44"
        strokeWidth="1.5"
        className={STRUCTURE}
      />
      <circle cx="52" cy="32" r="2.5" className="fill-muted-foreground/45" />
      <circle cx="61" cy="32" r="2.5" className="fill-muted-foreground/45" />
      <circle cx="70" cy="32" r="2.5" className="fill-muted-foreground/45" />
      {/* redacted URL */}
      <rect x="52" y="56" width="66" height="14" rx="7" className="fill-primary/15" />
      <circle cx="64" cy="63" r="2" className="fill-primary" />
      <circle cx="74" cy="63" r="2" className="fill-primary" />
      <circle cx="84" cy="63" r="2" className="fill-primary" />
      <circle cx="94" cy="63" r="2" className="fill-primary" />
      {/* lock */}
      <rect
        x="128"
        y="59"
        width="16"
        height="13"
        rx="3"
        strokeWidth="1.5"
        className="stroke-primary"
      />
      <path
        d="M132 59v-3.5a4 4 0 0 1 8 0V59"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="stroke-primary"
      />
      {/* content lines */}
      <line
        x1="52"
        y1="86"
        x2="148"
        y2="86"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={STRUCTURE}
      />
      <line
        x1="52"
        y1="97"
        x2="126"
        y2="97"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={STRUCTURE}
      />
      <line
        x1="52"
        y1="108"
        x2="140"
        y2="108"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={STRUCTURE}
      />
    </svg>
  )
}

/** Step 2 — a matched-sites list arriving by email. */
export function IllustrationDigest() {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden="true"
      className="mx-auto h-auto w-full max-w-60"
    >
      {/* sheet sliding into the envelope */}
      <rect
        x="58"
        y="16"
        width="84"
        height="86"
        rx="6"
        strokeWidth="1.5"
        className={STRUCTURE}
      />
      {/* list rows */}
      <rect x="68" y="25" width="10" height="10" rx="2" strokeWidth="1.5" className={STRUCTURE} />
      <line x1="84" y1="30" x2="118" y2="30" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      <rect x="68" y="43" width="10" height="10" rx="2" strokeWidth="1.5" className={STRUCTURE} />
      <line x1="84" y1="48" x2="104" y2="48" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      {/* the row matched to your niche */}
      <rect
        x="110"
        y="43"
        width="22"
        height="10"
        rx="5"
        strokeWidth="1.5"
        className="stroke-primary"
      />
      <rect x="68" y="61" width="10" height="10" rx="2" strokeWidth="1.5" className={STRUCTURE} />
      <line x1="84" y1="66" x2="118" y2="66" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      {/* envelope */}
      <rect
        x="42"
        y="78"
        width="116"
        height="48"
        rx="8"
        strokeWidth="1.5"
        className={`fill-background ${STRUCTURE}`}
      />
      <path
        d="M42 84l58 28 58-28"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={STRUCTURE}
      />
    </svg>
  )
}

/** Step 3 — both sides agreed, URLs revealed, links exchanged. */
export function IllustrationExchange() {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden="true"
      className="mx-auto h-auto w-full max-w-60"
    >
      {/* site A */}
      <rect x="22" y="42" width="62" height="62" rx="8" strokeWidth="1.5" className={STRUCTURE} />
      <line x1="32" y1="60" x2="66" y2="60" strokeWidth="2" strokeLinecap="round" className="stroke-primary" />
      <line x1="32" y1="73" x2="74" y2="73" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      <line x1="32" y1="85" x2="60" y2="85" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      {/* site B */}
      <rect x="116" y="42" width="62" height="62" rx="8" strokeWidth="1.5" className={STRUCTURE} />
      <line x1="126" y1="60" x2="160" y2="60" strokeWidth="2" strokeLinecap="round" className="stroke-primary" />
      <line x1="126" y1="73" x2="168" y2="73" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      <line x1="126" y1="85" x2="154" y2="85" strokeWidth="1.5" strokeLinecap="round" className={STRUCTURE} />
      {/* the swap */}
      <path
        d="M90 62h19m-5.5-4.5L109 62l-5.5 4.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      <path
        d="M110 86H91m5.5-4.5L91 86l5.5 4.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      {/* both parties agreed */}
      <circle cx="53" cy="42" r="9" strokeWidth="1.5" className="fill-background stroke-primary" />
      <path
        d="M48.5 42.2l3.2 3.2 6-6.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      <circle cx="147" cy="42" r="9" strokeWidth="1.5" className="fill-background stroke-primary" />
      <path
        d="M142.5 42.2l3.2 3.2 6-6.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
    </svg>
  )
}
