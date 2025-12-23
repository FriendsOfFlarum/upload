# Upgrade Guide for Flarum 2.0

## AWS S3 Adapter Name Changes

### Background

In earlier versions of fof/upload, both `'aws-s3'` and `'awss3'` adapter names were registered, but only `'aws-s3'` had a corresponding method. This caused validation errors when trying to use the `'awss3'` adapter name.

A fix was implemented to provide bidirectional compatibility: both adapter names now work and map to the same `awsS3()` method. This ensures backward compatibility for:
- Old files in the database with `upload_method = 'awss3'` or `upload_method = 'aws-s3'`
- Admin configurations forcing one variant while DB has the other
- MIME type configurations using either variant

### Changes for Flarum 2.0

For Flarum 2.0, we will standardize on `'aws-s3'` as the canonical adapter name and remove support for `'awss3'`.

### Migration Steps

#### 1. Database Migration

Create a migration to update all existing records:

```php
<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // Update files table
        $schema
            ->getConnection()
            ->table('fof_upload_files')
            ->where('upload_method', 'awss3')
            ->update(['upload_method' => 'aws-s3']);

        // Update MIME type settings
        $mimeConfiguration = $schema
            ->getConnection()
            ->table('settings')
            ->where('key', 'fof-upload.mimeTypes')
            ->value('value');

        if ($mimeConfiguration) {
            $mimeConfiguration = json_decode($mimeConfiguration, true);

            foreach ($mimeConfiguration as $mime => &$config) {
                if (isset($config['adapter']) && $config['adapter'] === 'awss3') {
                    $config['adapter'] = 'aws-s3';
                }
            }

            $schema
                ->getConnection()
                ->table('settings')
                ->where('key', 'fof-upload.mimeTypes')
                ->update(['value' => json_encode($mimeConfiguration)]);
        }
    },
];
```

#### 2. Code Changes

Search for `TODO: Flarum 2.0` in the codebase and make the following changes:

**src/Adapters/Manager.php:**
- Line 55: Remove `'awss3' => class_exists(S3Client::class),`
- Lines 76-83: Remove the bidirectional compatibility check block
- Lines 89-92: Remove the normalization line, use `$adapter` directly

**resources/locale/en.yml:**
- Line 144: Remove `awss3: AWS S3` translation entry

**Tests to Remove:**
- `tests/unit/Adapters/ManagerTest.php`:
  - Line 72: Remove `'awss3'` assertion
  - Lines 102-138: Remove `instantiate_normalizes_awss3_to_aws_s3` test

- `tests/integration/api/AdaptersExtenderTest.php`:
  - Lines 28-49: Remove `force_extender_limits_available_adapters_to_awss3` test
  - Lines 51-84: Remove `force_extender_allows_instantiation_of_forced_awss3_adapter` test
  - Line 177: Remove `'awss3'` assertion
  - Lines 186-228: Remove `force_aws_s3_when_db_has_awss3_configuration` test
  - Lines 230-272: Remove `force_awss3_when_db_has_aws_s3_configuration` test
  - Lines 274-311: Remove `awss3_instantiation_works_with_normalization` test

#### 3. Update Documentation

Update any user-facing documentation that references the `'awss3'` adapter name to use `'aws-s3'` instead.

#### 4. Breaking Change Notice

Add a breaking change notice in the changelog:

```markdown
### Breaking Changes

- **AWS S3 Adapter:** The legacy `'awss3'` adapter name has been removed. The canonical name is now `'aws-s3'`.
  - If you were using `->force('awss3')` in your `extend.php`, change it to `->force('aws-s3')`
  - Database records are automatically migrated during upgrade
```

### Testing

After applying these changes:

1. Run all unit tests: `composer test:unit`
2. Run all integration tests: `composer test:integration`
3. Verify that:
   - Files with `upload_method = 'aws-s3'` can be rendered
   - New uploads use `'aws-s3'` as the adapter name
   - Forcing `'aws-s3'` works correctly
   - Old references to `'awss3'` no longer exist in the codebase

### Support Period

The bidirectional compatibility (`'awss3'` ⇄ `'aws-s3'`) will be maintained until Flarum 2.0 is released. This gives administrators time to:
- Update their `extend.php` configurations
- Run the migration
- Test their installations
