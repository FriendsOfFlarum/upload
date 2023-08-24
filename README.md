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
composer require fof/upload "*"
```

## Updating

```sh
composer require fof/upload "*"
php flarum migrate
php flarum cache:clear
```

## Configuration

Enable the extension, a new tab will appear on the left hand side. This separate settings page allows you to further configure the extension.

Make sure you configure the upload permission on the permissions page as well.

### Mimetype regular expression

Regular expressions allow you a lot of freedom, but they are also very difficult to understand. Here are some pointers, but feel free to ask
for help on the official Flarum forums.

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

Using `php flarum fof:upload` you have a powerful tool in your hands to map uploads to posts and
clean up unused files. To do so there are two steps to take into consideration:

- Mapping (`--map`) allows you to look through posts to identify whether which uploaded files have been used inside any posts, and store this information
- Clean up (`--cleanup`, `--cleanup-before=yyyy-mm-dd`) grants you to ability to remove files that have been uploaded before the given time and haven't been mapped to any (existing) posts.

The intent of this command stems from the original concept of understand what uploads are used where and to allow removal
of unused, stale files. You can run this command manually or as a cronjob.

Example 1; only mapping files:

```bash
php flarum fof:upload --map
```

Example 2; map and clean up

```bash
php flarum fof:upload --map --cleanup --cleanup-before="a month ago"
```

Once you're happy with how the command operates, you can append the flag `--force`, which removes the need to confirm
the action:

```bash
php flarum fof:upload --map --cleanup --cleanup-before="last year" --force
```

The following (to resume) will happen when this command is put into a recurring cronjob:

- based on the interval of the cronjob (daily, weekly or however)
- the command will go over all uploads to discover in which posts they have been used
- delete those files that have been uploaded "last year" that have not been found in posts

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
