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
export declare function findProvider(key: string): S3Provider;
/**
 * Best-effort guess at which provider an existing configuration belongs to, so
 * upgrading admins see their setup already identified rather than being reset
 * to "Amazon S3".
 *
 * Deliberately conservative: only the endpoint host is inspected, and anything
 * unrecognised falls back to AWS (no endpoint) or Other (some endpoint).
 */
export declare function detectProvider(endpoint: string | null | undefined): string;
/** Options map for the Select component. */
export declare function providerOptions(): Record<string, string>;
