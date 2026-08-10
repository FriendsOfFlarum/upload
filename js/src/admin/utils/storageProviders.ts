/**
 * S3-compatible provider presets.
 *
 * Configuring a non-AWS S3 provider previously meant knowing four separate
 * answers — endpoint format, whether path-style addressing is required, whether
 * the provider supports ACLs, and what public URL the objects are served from —
 * none of which the settings page stated. Picking a provider here fills those in.
 *
 * `endpointHint` and `customUrlHint` are placeholder text rather than values:
 * both contain account-specific parts the admin has to supply.
 */
export interface S3Provider {
  key: string;
  /** Untranslated display name — these are product names, not UI copy. */
  name: string;
  /** Placeholder shown in the endpoint field. Empty means "leave blank". */
  endpointHint: string;
  /** Whether this provider requires path-style bucket addressing. */
  pathStyle: boolean;
  /**
   * Whether the provider honours S3 canned ACLs. Providers that ignore them
   * (R2, most MinIO deployments) reject or silently drop an ACL header, so the
   * field is cleared and disabled.
   */
  supportsAcl: boolean;
  /** Placeholder for the public URL objects are served from. */
  customUrlHint: string;
  /** Whether a region value is meaningful for this provider. */
  needsRegion: boolean;
}

/**
 * Not exported: Flarum's export registry mangles an all-caps identifier
 * beginning with a digit-bearing prefix (S3_PROVIDERS became a bare `S` in the
 * bundle, throwing a ReferenceError at load). Nothing outside this module needs
 * the raw list anyway — use the accessors below.
 */
const PROVIDERS: S3Provider[] = [
  {
    key: 'aws',
    name: 'Amazon S3',
    endpointHint: '',
    pathStyle: false,
    supportsAcl: true,
    customUrlHint: 'https://cdn.example.com',
    needsRegion: true,
  },
  {
    key: 'cloudflare-r2',
    name: 'Cloudflare R2',
    endpointHint: 'https://<account-id>.r2.cloudflarestorage.com',
    pathStyle: true,
    // R2 has no ACL support; objects are public via a bound custom domain.
    supportsAcl: false,
    customUrlHint: 'https://files.example.com',
    needsRegion: false,
  },
  {
    key: 'backblaze-b2',
    name: 'Backblaze B2',
    endpointHint: 'https://s3.<region>.backblazeb2.com',
    pathStyle: false,
    supportsAcl: false,
    customUrlHint: 'https://<bucket>.s3.<region>.backblazeb2.com',
    needsRegion: true,
  },
  {
    key: 'digitalocean-spaces',
    name: 'DigitalOcean Spaces',
    endpointHint: 'https://<region>.digitaloceanspaces.com',
    pathStyle: false,
    supportsAcl: true,
    customUrlHint: 'https://<bucket>.<region>.cdn.digitaloceanspaces.com',
    needsRegion: true,
  },
  {
    key: 'minio',
    name: 'MinIO',
    endpointHint: 'https://minio.example.com',
    pathStyle: true,
    supportsAcl: false,
    customUrlHint: 'https://minio.example.com/<bucket>',
    needsRegion: false,
  },
  {
    key: 'other',
    name: 'Other S3-compatible',
    endpointHint: 'https://s3.example.com',
    pathStyle: false,
    supportsAcl: true,
    customUrlHint: '',
    needsRegion: true,
  },
];

export function findProvider(key: string): S3Provider {
  return PROVIDERS.find((p) => p.key === key) ?? PROVIDERS[0];
}

/**
 * Best-effort guess at which provider an existing configuration belongs to, so
 * upgrading admins see their setup already identified rather than being reset
 * to "Amazon S3".
 *
 * Deliberately conservative: only the endpoint host is inspected, and anything
 * unrecognised falls back to AWS (no endpoint) or Other (some endpoint).
 */
export function detectProvider(endpoint: string | null | undefined): string {
  const value = (endpoint ?? '').trim().toLowerCase();

  if (!value) return 'aws';
  if (value.includes('r2.cloudflarestorage.com')) return 'cloudflare-r2';
  if (value.includes('backblazeb2.com')) return 'backblaze-b2';
  if (value.includes('digitaloceanspaces.com')) return 'digitalocean-spaces';
  if (value.includes('amazonaws.com')) return 'aws';

  return 'other';
}

/** Options map for the Select component. */
export function providerOptions(): Record<string, string> {
  return Object.fromEntries(PROVIDERS.map((p) => [p.key, p.name]));
}
