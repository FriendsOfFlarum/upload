import app from 'flarum/admin/app';
import FormModal from 'flarum/common/components/FormModal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';
import type Mithril from 'mithril';

interface InspectionResult {
  laravel_validation?: boolean;
  laravel_validation_error?: string;
  mime_detector?: string;
  php_mime?: string;
  guessed_extension?: string;
}

export default class InspectMimeModal extends FormModal {
  uploading = false;
  inspection: InspectionResult = {};

  oninit(vnode: Mithril.Vnode<Record<string, never>, this>) {
    super.oninit(vnode);

    this.uploading = false;
    this.inspection = {};
  }

  className(): string {
    return 'Modal--small fof-upload-inspect-mime-modal';
  }

  title(): string {
    return app.translator.trans('fof-upload.admin.inspect-mime.title') as string;
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <p>
          {app.translator.trans('fof-upload.admin.inspect-mime.description', {
            a: (
              <Link href="https://github.com/SoftCreatR/php-mime-detector" external={true} target="_blank">
                PHP Mime Detector
              </Link>
            ),
          })}
        </p>
        <p>{app.translator.trans('fof-upload.admin.inspect-mime.select')}</p>
        <div>
          <input type="file" onchange={(e: Event) => this.onupload(e)} disabled={this.uploading} />
          {this.uploading ? <LoadingIndicator /> : null}
        </div>
        <dl>
          <dt>{app.translator.trans('fof-upload.admin.inspect-mime.laravel-validation')}</dt>
          <dd>
            {typeof this.inspection.laravel_validation === 'undefined' ? (
              <em>{app.translator.trans('fof-upload.admin.inspect-mime.no-file-selected')}</em>
            ) : this.inspection.laravel_validation ? (
              app.translator.trans('fof-upload.admin.inspect-mime.validation-passed')
            ) : (
              app.translator.trans('fof-upload.admin.inspect-mime.validation-failed', {
                error: this.inspection.laravel_validation_error || '?',
              })
            )}
          </dd>
        </dl>
        <dl>
          <dt>{app.translator.trans('fof-upload.admin.inspect-mime.mime-detector')}</dt>
          <dd>
            {this.inspection.mime_detector ? (
              <code>{this.inspection.mime_detector}</code>
            ) : (
              <em>{app.translator.trans('fof-upload.admin.inspect-mime.not-available')}</em>
            )}
          </dd>
        </dl>
        <dl>
          <dt>{app.translator.trans('fof-upload.admin.inspect-mime.mime-fileinfo')}</dt>
          <dd>
            {this.inspection.php_mime ? (
              <code>{this.inspection.php_mime}</code>
            ) : (
              <em>{app.translator.trans('fof-upload.admin.inspect-mime.not-available')}</em>
            )}
          </dd>
        </dl>
        <dl>
          <dt>{app.translator.trans('fof-upload.admin.inspect-mime.guessed-extension')}</dt>
          <dd>
            {this.inspection.guessed_extension ? (
              <code>{this.inspection.guessed_extension}</code>
            ) : (
              <em>{app.translator.trans('fof-upload.admin.inspect-mime.not-available')}</em>
            )}
          </dd>
        </dl>
      </div>
    );
  }

  onupload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const body = new FormData();

    for (let i = 0; i < target.files!.length; i++) {
      body.append('files[]', target.files![i]);
    }

    this.uploading = true;

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/fof/upload/inspect-mime',
        serialize: (raw: FormData) => raw,
        body,
      })
      .then((result: unknown) => {
        const inspection = result as InspectionResult;
        this.uploading = false;
        this.inspection = inspection;
        m.redraw();
      })
      .catch((error: unknown) => {
        this.uploading = false;
        this.inspection = {};
        m.redraw();

        throw error;
      });
  }
}
