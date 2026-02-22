# Upload by FriendsOfFlarum

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FriendsOfFlarum/upload/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/upload.svg)](https://packagist.org/packages/fof/upload) [![Total Downloads](https://img.shields.io/packagist/dt/fof/upload.svg)](https://packagist.org/packages/fof/upload) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)

An extension that handles file uploads intelligently for your forum.

## Features

- For images:
  - Auto watermarks with proportional scaling, opacity and padding controls.
  - Auto resizing.
  - Dimension storage (width × height) for JPEG, PNG, and GIF — prevents layout shifts when images lazy-load.
  - WebP thumbnail generation at upload time — reduces bandwidth; clicking the thumbnail opens the original in a new tab.
  - Animated GIF support for resize operations.
- Mime type to upload adapter mapping.
- Whitelisting mime types.
- Uploading on different storage services (local, imgur, AWS S3 for instance).
- Drag and drop uploads.
- Uploading multiple files at once (button and drag and drop both support this).
- Easily extendable, the extension heavily relies on Events.
- Extender interface to disable or force particular adapters (see below)

## Installation

Install manually:

```sh
composer require fof/upload:"*"
```

## Updating

```sh
composer require fof/upload:"*"
php flarum migrate
php flarum cache:clear
```

## Configuration

Enable the extension, a new tab will appear on the left hand side. This separate settings page allows you to further configure the extension.

On new installations, a pre-defined regex will be inserted for you that enables image uploads, restricted to safe image types. We now include SVG as safe, due to our SVG sanitization method. Default image types allowed are:

- JPEG
- PNG
- GIF
- WebP
- AVIF
- BMP
- TIFF
- SVG

The regex for these types is `^image\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\+xml)$`, and can be modified as required. We **STRONGLY** discourage the use of a wildcard such as `^image\/.*`, as this could introduce vulnerabilities in the uploaded files. Versions of `fof/upload` prior to `1.8.0` used this as default, and is considered insecure.

Make sure you configure the upload permission on the permissions page as well.

### Per-Mime-Type Permission Scoping

Each mime type row can be given an optional **Permission label** (e.g. `Images`, `Videos`, `Documents`). When a label is set, FoF Upload automatically:

1. Creates a dedicated permission in the Flarum permission grid — e.g. `Upload Images` — scoped to the **Start** section.
2. Defaults that permission to the **Member** group on first use, preserving existing access.
3. Enforces **AND logic**: a user must hold *both* the base `Upload files` permission *and* the mime-specific permission to upload that file type.

**Use cases:**
- Allow Members to upload images but restrict video uploads to Staff.
- Require a "Trusted" group role to upload ZIP archives or executable files.
- Mix restricted and unrestricted types freely — mime types without a permission label require only the base upload permission (fully backwards-compatible).

**How to configure:**
1. Go to **Admin → Extensions → FoF Upload**.
2. In the Mime Types section, enter a label in the **Permission label** field for any type you want to restrict (e.g. `Images`).
3. Save settings — the permission appears immediately in **Admin → Permissions** under the Start section.
4. Adjust which groups have that permission as needed.

### Watermark Configuration

When **Watermark images** is enabled, FoF Upload stamps every uploaded JPEG or PNG with a watermark image. Three settings let you control how the watermark looks:

| Setting | Default | Description |
|---|---|---|
| **Watermark size (% of image width)** | `25` | The watermark is scaled so its width equals this percentage of the uploaded image's width. A value of `25` means the watermark will always be one-quarter the width of the image, regardless of upload dimensions. |
| **Watermark opacity (0–100)** | `100` | Opacity of the placed watermark. `100` is fully opaque; `0` is invisible. |
| **Padding from edge (px)** | `10` | Inward pixel offset from the corner or edge set by the **Position** field. Set to `0` to place the watermark flush against the edge. |

**How to configure:**
1. Go to **Admin → Extensions → FoF Upload**.
2. Enable **Watermark images** and upload your watermark file.
3. Choose a **Position** (e.g. `bottom-right`).
4. Adjust size %, opacity, and padding to taste.
5. Save — the settings are applied to every new image upload.

> **Backwards compatibility:** Existing installs that used watermarks before these settings were introduced will use the defaults on next upload: 25% width, 100% opacity, 10 px padding. Set padding to `0` to restore the previous flush-edge behaviour.

### Image Dimensions & Layout Shift Prevention

FoF Upload automatically stores the width and height (in pixels) of every JPEG, PNG, and GIF processed at upload time. These are recorded after any resizing or EXIF orientation correction is applied, so they always reflect the **final image as stored**.

The stored dimensions are injected as `width` and `height` HTML attributes on the `<img>` tag rendered by the **Image Preview** template. Modern browsers use these attributes to reserve the correct amount of layout space before the image has loaded, eliminating [Cumulative Layout Shift (CLS)](https://web.dev/cls/) in threads that contain lazy-loaded images.

**No configuration is required** — this happens automatically for all new JPEG, PNG, and GIF uploads. Images uploaded before this feature was added will not have stored dimensions; they continue to render without `width`/`height` attributes and are unaffected.

> **GIF support:** Animated GIF uploads now also benefit from the **Resize images** setting. Watermarks are intentionally not applied to GIFs to avoid palette quality degradation.

### Image Thumbnails

FoF Upload can generate a **downscaled thumbnail** at upload time to significantly reduce bandwidth for large-image forums. The original file is always kept intact.

When enabled, the **Image Preview** template displays the thumbnail as the visible image and wraps it in a link to the original — clicking the image opens the full-resolution file in a new tab.

#### How it works

1. After the image is processed (resize, watermark, orientation), a copy is scaled down to a configurable maximum width (default: **1000 px**).
2. The thumbnail is encoded as **WebP** by default (~30% smaller than JPEG at equivalent quality) or in the original format if WebP is disabled.
3. The thumbnail is stored alongside the original in the same storage backend (Local, S3, Qiniu). Imgur uploads are excluded — Imgur manages its own thumbnails.
4. The thumbnail **path** is stored in the database. The full URL is derived from the live storage hostname at render time (same as the main file URL), so CDN domain changes are reflected automatically without re-processing.

#### Settings

| Setting | Default | Description |
|---|---|---|
| **Generate thumbnails on upload** | On | Master toggle. Disable to revert to full-resolution images in the Image Preview template. |
| **Encode thumbnails as WebP** | On | Use WebP encoding for the thumbnail. Disable to use the original image format (JPEG/PNG/GIF). |
| **Thumbnail max width (px)** | `1000` | Thumbnails are scaled down so neither dimension exceeds this value. Images smaller than this are not upscaled. |

#### Backwards compatibility

- **Old posts:** Existing posts have no `thumbnail_path` stored. The formatter falls back to the original full-resolution URL — no change in appearance.
- **Imgur uploads:** Thumbnails are not generated (Imgur handles image hosting directly).
- **Private-shared files:** Thumbnails are not generated for private files.

### Storage Configuration

FoF Upload supports configuration via both the admin panel (database settings) and environment variables. **Environment variables take precedence** over database settings when configured.

#### Environment Variable Configuration

You can configure storage adapters using environment variables, which is particularly useful for:
- Docker/containerized deployments
- CI/CD pipelines
- Multi-environment setups (dev/staging/production)
- Keeping credentials out of the database

##### AWS S3 / S3-Compatible Storage

To configure S3 via environment variables, set **all four required variables**:

```bash
# Required (all 4 must be set)
FOF_UPLOAD_AWS_S3_KEY=your-access-key
FOF_UPLOAD_AWS_S3_SECRET=your-secret-key
FOF_UPLOAD_AWS_S3_BUCKET=your-bucket-name
FOF_UPLOAD_AWS_S3_REGION=us-east-1

# Optional
FOF_UPLOAD_AWS_S3_ACL=public-read                    # Object ACL (public-read, private, etc.)
FOF_UPLOAD_AWS_S3_ENDPOINT=https://s3.example.com    # For S3-compatible services (MinIO, Wasabi, etc.)
FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT=true           # Required for MinIO and some S3-compatible services
FOF_UPLOAD_AWS_S3_CUSTOM_URL=https://cdn.example.com # Custom domain for your bucket
FOF_UPLOAD_CDN_URL=https://cdn.example.com           # CDN URL for serving files
```

**IAM Role Authentication (EC2/ECS/EKS)**:

For environments with IAM roles (EC2 instances, ECS tasks, EKS pods), you can omit credentials:

```bash
# Required for IAM mode
FOF_UPLOAD_AWS_S3_BUCKET=your-bucket-name
FOF_UPLOAD_AWS_S3_REGION=us-east-1
FOF_UPLOAD_AWS_S3_USE_IAM=true  # Enable IAM role authentication

# Optional (same as above)
FOF_UPLOAD_AWS_S3_ACL=public-read
FOF_UPLOAD_CDN_URL=https://cdn.example.com
```

When `FOF_UPLOAD_AWS_S3_USE_IAM=true`, credentials are not required and the AWS SDK will automatically use the instance/pod IAM role.

**Important Notes:**
- Traditional mode: All 4 variables (`KEY`, `SECRET`, `BUCKET`, `REGION`) must be set
- IAM mode: Only `BUCKET`, `REGION`, and `USE_IAM=true` are required
- If any required variable is missing, the extension falls back to database settings
- Environment variables always override database settings when fully configured

##### S3-Compatible Services

**LocalStack** (local development):
```bash
FOF_UPLOAD_AWS_S3_KEY=test
FOF_UPLOAD_AWS_S3_SECRET=test
FOF_UPLOAD_AWS_S3_BUCKET=uploads
FOF_UPLOAD_AWS_S3_REGION=us-east-1
FOF_UPLOAD_AWS_S3_ENDPOINT=http://localhost:4566
FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT=true  # Required for LocalStack!
```

**MinIO** (self-hosted):
```bash
FOF_UPLOAD_AWS_S3_KEY=minioadmin
FOF_UPLOAD_AWS_S3_SECRET=minioadmin
FOF_UPLOAD_AWS_S3_BUCKET=uploads
FOF_UPLOAD_AWS_S3_REGION=us-east-1
FOF_UPLOAD_AWS_S3_ENDPOINT=https://minio.example.com
FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT=true  # Required for MinIO!
```

**DigitalOcean Spaces**:
```bash
FOF_UPLOAD_AWS_S3_KEY=your-spaces-key
FOF_UPLOAD_AWS_S3_SECRET=your-spaces-secret
FOF_UPLOAD_AWS_S3_BUCKET=your-space-name
FOF_UPLOAD_AWS_S3_REGION=nyc3
FOF_UPLOAD_AWS_S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

**Wasabi**:
```bash
FOF_UPLOAD_AWS_S3_KEY=your-wasabi-key
FOF_UPLOAD_AWS_S3_SECRET=your-wasabi-secret
FOF_UPLOAD_AWS_S3_BUCKET=your-bucket
FOF_UPLOAD_AWS_S3_REGION=us-east-1
FOF_UPLOAD_AWS_S3_ENDPOINT=https://s3.wasabisys.com
```

**Backblaze B2**:
```bash
FOF_UPLOAD_AWS_S3_KEY=your-key-id
FOF_UPLOAD_AWS_S3_SECRET=your-application-key
FOF_UPLOAD_AWS_S3_BUCKET=your-bucket
FOF_UPLOAD_AWS_S3_REGION=us-west-004
FOF_UPLOAD_AWS_S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

##### Local Storage with CDN

For local storage with a CDN in front:
```bash
FOF_UPLOAD_CDN_URL=https://cdn.example.com
```

#### Configuration Priority

1. **Environment Variables** (highest priority - when all required vars are set)
2. **Database Settings** (admin panel configuration)
3. **Defaults** (null values if neither is configured)

### Mimetype regular expression

Regular expressions allow you a lot of freedom, but they are also very difficult to understand. Here are some pointers, but feel free to ask for help on the official Flarum forums, or check out [regex101.com](https://regex101.com/) where you can interactively build and test your regex pattern.

In case you want to allow all regular file types including video, music, compressed files and images, use this:

```text
(video\/(3gpp|mp4|mpeg|quicktime|webm))|(audio\/(aiff|midi|mpeg|mp4))|(image\/(gif|jpeg|png))|(application\/(x-(7z|rar|zip)-compressed|zip|arj|x-(bzip2|gzip|lha|stuffit|tar)|pdf))
```

A mimetype consists of a primary and secondary type. The primary type can be `image`, `video` and `application` for instance.
The secondary is like a more detailed specification, eg `png`, `pdf` etc. These two are divided by a `/`, in regex you have to escape this character by using: `\/`.


### Disable or Force a particular adapter

In some circumstances, you may wish to either disable an adapter, or force the use of one. This is set in your root `extend.php` file.

For example, you may disable `imgur`
```
(new FoF\Upload\Extend\Adapters())
        ->disable('imgur'),
```

Chaining of multiple commands is also possible:
```
(new FoF\Upload\Extend\Adapters())
        ->disable('imgur')
        ->disable('aws-s3'),
```

You may also force an adapter:
```
(new FoF\Upload\Extend\Adapters())
        ->force('imgur'),
```

Adapter names currently available:
- `local`
- `imgur`
- `qiniu`
- `aws-s3`

## Commands

### MapFilesCommand

The `php flarum fof:upload` command helps you keep file storage clean by mapping uploaded files to
the posts they appear in, and removing files that were never used in any post (e.g. uploaded by a
user who never submitted their draft, or by spammers abusing the upload endpoint).

#### How matching works

When a post is saved or edited, files are automatically linked to it based on what appears in the
post content. The command's `--map` flag lets you rebuild these associations in bulk — useful after
an import, a migration, or if associations were lost.

Matching looks for the file's **URL or UUID** in post content, so all built-in templates are
covered:

| Template | What appears in post content |
|---|---|
| Default File Download | `[upl-file uuid=… size=…]name[/upl-file]` — UUID only |
| Image Preview | `[upl-image-preview uuid=… url=…]` — both |
| Image | `[upl-image uuid=… url=…]` — both |
| Text Preview | `[upl-text-preview uuid=… url=…]` — both |
| Just URL | raw URL |
| Markdown Image | `![alt](url)` |
| BBCode Image | `[URL=…][IMG]…[/IMG][/URL]` |

> **Note:** Shared files (uploaded via the shared file manager) are intentionally not associated
> with individual posts and are **never** removed by cleanup.

#### Options

| Option | Description |
|---|---|
| `--map` | Scan all posts and link files to the posts where they appear. Safe to run at any time. |
| `--cleanup` | Delete files that have no post associations and were uploaded before the cutoff date. Always run `--map` first. |
| `--cleanup-before=DATE` | Set the cutoff date for cleanup. Any date string accepted by PHP's `strtotime` works: `"yesterday"`, `"1 week ago"`, `"2024-01-01"`, `"now"`. Defaults to 24 hours ago. |
| `--force` | Skip per-file confirmation prompts. **Use with caution.** |

#### Examples

Map files only (no deletions):

```bash
php flarum fof:upload --map
```

Map and clean up files uploaded more than a month ago that have no post association — with
per-file confirmation:

```bash
php flarum fof:upload --map --cleanup --cleanup-before="1 month ago"
```

Same, but skip confirmation prompts (suitable for a cronjob):

```bash
php flarum fof:upload --map --cleanup --cleanup-before="1 month ago" --force
```

#### Recommended workflow

> **Always run `--map` before `--cleanup`.** Without mapping first, files that are genuinely in
> use may appear orphaned and be deleted.

1. Run `--map` first to rebuild file-to-post associations.
2. Review what would be deleted by running `--cleanup` without `--force` (you will be prompted per file).
3. Once satisfied, add `--force` for unattended runs.

For ongoing maintenance, a daily cronjob is a sensible setup:

```bash
# Remove files older than 24 hours (the default) that are not in any post
php flarum fof:upload --map --cleanup --force
```

### BackfillImageDimensionsCommand

The `php flarum fof:upload:backfill-dimensions` command retroactively stores `image_width` and `image_height` for existing JPEG, PNG, and GIF uploads that were created before the dimension-storage feature was introduced.

The command downloads each image (using whatever storage backend the file was uploaded to — local, S3, CDN, etc.), reads its dimensions with Intervention Image, and saves them to the database. Images that already have dimensions stored are skipped automatically.

#### Options

| Option | Description |
|---|---|
| `--chunk=N` | Process files in batches of N (default: `100`). Reduce this if memory is a concern. |
| `--dry-run` | Print how many images would be processed without making any changes. |

#### Examples

Preview how many images need backfilling:

```bash
php flarum fof:upload:backfill-dimensions --dry-run
```

Run the backfill with the default chunk size:

```bash
php flarum fof:upload:backfill-dimensions
```

Run with a smaller chunk size on a large forum:

```bash
php flarum fof:upload:backfill-dimensions --chunk=25
```

> **Note:** The command is safe to run multiple times — it only processes images where `image_width` is still `NULL`. If a file is unreachable (e.g. deleted from storage) it is skipped with a warning and the command continues.

### BackfillThumbnailsCommand

The `php flarum fof:upload:backfill-thumbnails` command generates thumbnails for existing JPEG, PNG, and GIF uploads that were created before the thumbnail feature was introduced (or while the feature was disabled).

The command downloads each image via the same storage backend used to upload it, scales it to the configured thumbnail width, encodes it as WebP (or the original format if WebP is disabled), and writes the thumbnail file alongside the original. Uploads already having a `thumbnail_url` are skipped automatically.

> **Note:** Imgur and private-shared uploads are skipped — thumbnails are not supported for those backends.

#### Options

| Option | Description |
|---|---|
| `--chunk=N` | Process files in batches of N (default: `50`). Reduce this on very large forums. |
| `--dry-run` | Print how many images would be processed without making any changes. |

#### Examples

Preview how many images need thumbnails:

```bash
php flarum fof:upload:backfill-thumbnails --dry-run
```

Run with the default chunk size:

```bash
php flarum fof:upload:backfill-thumbnails
```

Run with a smaller chunk size on a large forum:

```bash
php flarum fof:upload:backfill-thumbnails --chunk=20
```

> **Note:** The command is safe to run multiple times. If a file is unreachable it is skipped with a warning and processing continues.

## Testing and Security Measures

FoF Upload includes **automated tests** to ensure:

✅ Valid files upload successfully
✅ Restricted files are blocked
✅ SVG sanitization removes potential XSS risks

### 🔍 Security Tests for Malicious Files
We specifically test against:
- HTML Injection (`.html` disguised as an image)
- MIME Spoofing (e.g., `.png` containing a script)
- Polygot Files (Files that act as two different formats)
- SVG Sanitization (`<script>`, `<foreignObject>`, event handlers, external styles, etc)
- ZIP & APK Handling (Ensuring APKs are valid and ZIPs are not misclassified)

### Submitting Additional Test Cases
We welcome community contributes in all our extensions! Especially where security is concerned. If you find a new edge case or a file format that bypasses validation, please:
- Open an issue on [GitHub](https://github.com/FriendsOfFlarum/upload/issues)
- Submit a test case as a PR under `tests/`
- Describe the expected behaviour (Should the file be accepted? Should it be sanitized?)

🚀 These tests ensure FoF Upload remains secure and reliable for all Flarum users! 🚀

## FAQ

-  __AWS S3__: read the [AWS S3 configuration page](https://github.com/FriendsOfFlarum/upload/wiki/aws-s3).
-  __Adding Templates__: read the [Custom Templates wiki page](https://github.com/FriendsOfFlarum/upload/wiki/Custom-Templates).
- __Upgrading from flagrow/upload__: read the [wiki article](https://github.com/FriendsOfFlarum/upload/wiki/Upgrade-from-Flagrow-Upload).

## Links

- [![OpenCollective](https://img.shields.io/badge/donate-friendsofflarum-44AEE5?style=for-the-badge&logo=open-collective)](https://opencollective.com/fof/donate)
- [Flarum Discuss post](https://discuss.flarum.org/d/4154)
- [Source code on GitHub](https://github.com/FriendsOfFlarum/upload)
- [Report an issue](https://github.com/FriendsOfFlarum/upload/issues)
- [Download via Packagist](https://packagist.org/packages/fof/upload)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum)
