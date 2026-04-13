function ensureProtocol(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export default function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={ensureProtocol(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
