# Upload by FriendsOfFlarum

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FriendsOfFlarum/upload/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/upload.svg)](https://packagist.org/packages/fof/upload) [![Total Downloads](https://img.shields.io/packagist/dt/fof/upload.svg)](https://packagist.org/packages/fof/upload) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)

An extension that handles file uploads intelligently for your forum.

## Features

- For images:
  - Auto watermarks.
  - Auto resizing.
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
