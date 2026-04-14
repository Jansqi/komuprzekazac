'use client';

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          hiddenFields?: Record<string, string>;
          layout?: 'modal' | 'default';
          width?: number;
        }
      ) => void;
    };
  }
}

const WEBSITE_BUG_ID =
  process.env.NEXT_PUBLIC_TALLY_WEBSITE_BUG_ID ?? 'vGOaPg';
const DATA_BUG_ID =
  process.env.NEXT_PUBLIC_TALLY_DATA_BUG_ID ?? 'ob7ZAO';

type Variant = 'website' | 'data';
type SourceButton = 'website_bug' | 'data_bug' | 'footer';

interface Props {
  variant: Variant;
  /** Override default source label (e.g. 'footer' for the footer link). */
  source?: SourceButton;
  /** Required for variant="data" - passed as Tally hidden field. */
  krs?: string;
  /** Required for variant="data" - passed as Tally hidden field. */
  orgName?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ReportBugButton({
  variant,
  source,
  krs,
  orgName,
  className,
  children,
}: Props) {
  const formId = variant === 'website' ? WEBSITE_BUG_ID : DATA_BUG_ID;

  // Build-time fallback: if no ID configured, render nothing so the
  // build never fails on a missing env var.
  if (!formId) return null;

  const sourceButton: SourceButton =
    source ?? (variant === 'website' ? 'website_bug' : 'data_bug');

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    if (!window.Tally) {
      // Embed script not yet loaded - fail gracefully.
      console.warn('[ReportBugButton] Tally embed not loaded yet');
      return;
    }

    const hiddenFields: Record<string, string> = {
      page_url: window.location.href,
      source_button: sourceButton,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    if (variant === 'data') {
      if (krs) hiddenFields.krs = krs;
      if (orgName) hiddenFields.org_name = orgName;
    }

    window.Tally.openPopup(formId, {
      hiddenFields,
      layout: 'modal',
      width: 600,
    });
  };

  const defaultLabel =
    variant === 'website' ? 'Coś nie działa' : 'Zgłoś błąd danych';

  const ariaLabel =
    variant === 'website'
      ? 'Zgłoś błąd działania strony'
      : `Zgłoś błąd w danych organizacji${orgName ? ` ${orgName}` : ''}`;

  const defaultClass =
    variant === 'website'
      ? 'text-sm text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors'
      : 'inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#00b9fb] underline-offset-2 hover:underline transition-colors';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ?? defaultClass}
      aria-label={ariaLabel}
    >
      {children ?? defaultLabel}
    </button>
  );
}
