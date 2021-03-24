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

Install manually with composer:

```sh
composer require fof/upload
```

## Updating

```sh
composer require fof/upload
php flarum migrate
php flarum cache:clear
```

### Updating from Flagrow

This extension replaces [Flagrow Upload](https://packagist.org/packages/flagrow/upload).

To upgrade from the old extension to the new one:

- **Backup your data!** You should backup the database and the uploaded files.

- Make sure the latest version of Flagrow upload is installed and migrations have run:

```sh
composer require flagrow/upload
composer show flagrow/upload # You should see "versions: * 0.7.1" on the 4th line of output
php flarum migrate
```

- Disable the Upload extension in the admin panel.

- Run:

```sh
composer require fof/upload
```

Composer should let you know that `flagrow/upload` has been automatically removed.

- Enable the new extension in the admin panel.

- Your existing configuration and uploads meta will be migrated to FoF Upload automatically.

- The same file locations on the disk are used by FoF Upload, it means the files don't need to be moved.

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

## FAQ

-  __AWS S3__: read the [AWS S3 configuration page](https://github.com/FriendsOfFlarum/upload/wiki/aws-s3).
-  __Adding Templates__: read the [Custom Templates wiki page](https://github.com/FriendsOfFlarum/upload/wiki/Custom-Templates).

## Links

- [![OpenCollective](https://img.shields.io/badge/donate-friendsofflarum-44AEE5?style=for-the-badge&logo=open-collective)](https://opencollective.com/fof/donate)
- [Flarum Discuss post](https://discuss.flarum.org/d/4154)
- [Source code on GitHub](https://github.com/FriendsOfFlarum/upload)
- [Report an issue](https://github.com/FriendsOfFlarum/upload/issues)
- [Download via Packagist](https://packagist.org/packages/fof/upload)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum)
