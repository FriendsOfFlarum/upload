import app from 'flarum/admin/app';
import Modal, { type IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import LabelValue from 'flarum/common/components/LabelValue';
import Link from 'flarum/common/components/Link';
import type Mithril from 'mithril';

interface InspectionResult {
  laravel_validation?: boolean;
  laravel_validation_error?: string;
  mime_detector?: string;
  php_mime?: string;
  guessed_extension?: string;
}

export default class InspectMimeModal extends Modal<IInternalModalAttrs> {
  inspection: InspectionResult | null = null;
  fileName = '';
  input: HTMLInputElement | null = null;

  className(): string {
    return 'InspectMimeModal fof-upload-inspect-mime-modal Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans('fof-upload.admin.inspect-mime.title');
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <p className="helpText">
          {app.translator.trans('fof-upload.admin.inspect-mime.description', {
            a: <Link href="https://github.com/SoftCreatR/php-mime-detector" external={true} target="_blank" />,
          })}
        </p>
        <p className="helpText">{app.translator.trans('fof-upload.admin.inspect-mime.select')}</p>

        <div className="Form-group">
          <Button className="Button" icon="fas fa-file" loading={this.loading} onclick={() => this.input?.click()}>
            {app.translator.trans('fof-upload.admin.inspect-mime.choose')}
          </Button>
          <input
            type="file"
            hidden
            aria-hidden="true"
            tabindex="-1"
            oncreate={(vnode: Mithril.VnodeDOM) => (this.input = vnode.dom as HTMLInputElement)}
            onchange={(e: Event) => this.inspect(e.target as HTMLInputElement)}
          />
        </div>

        {this.inspection ? this.results(this.inspection) : null}
      </div>
    );
  }

  results(inspection: InspectionResult): Mithril.Children {
    const none = <em>{app.translator.trans('fof-upload.admin.inspect-mime.not-available')}</em>;
    const code = (value?: string) => (value ? <code>{value}</code> : none);

    return (
      <div className="InspectMimeModal-results" aria-live="polite">
        <p>
          <strong>{this.fileName}</strong>
        </p>
        <LabelValue
          label={app.translator.trans('fof-upload.admin.inspect-mime.laravel-validation')}
          value={
            inspection.laravel_validation
              ? app.translator.trans('fof-upload.admin.inspect-mime.validation-passed')
              : app.translator.trans('fof-upload.admin.inspect-mime.validation-failed', { error: inspection.laravel_validation_error || '?' })
          }
        />
        <LabelValue label={app.translator.trans('fof-upload.admin.inspect-mime.mime-detector')} value={code(inspection.mime_detector)} />
        <LabelValue label={app.translator.trans('fof-upload.admin.inspect-mime.mime-fileinfo')} value={code(inspection.php_mime)} />
        <LabelValue label={app.translator.trans('fof-upload.admin.inspect-mime.guessed-extension')} value={code(inspection.guessed_extension)} />
      </div>
    );
  }

  inspect(input: HTMLInputElement): void {
    const file = input.files?.[0];

    if (!file) return;

    const body = new FormData();
    body.append('files[]', file);

    this.loading = true;
    this.alertAttrs = null;
    this.fileName = file.name;

    app
      .request<InspectionResult>({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/fof/upload/inspect-mime',
        serialize: (raw: FormData) => raw,
        body,
        errorHandler: (error) => {
          this.alertAttrs = error.alert;
        },
      })
      .then(
        (inspection) => (this.inspection = inspection),
        () => (this.inspection = null)
      )
      .finally(() => {
        this.loading = false;
        input.value = '';
        m.redraw();
      });
  }
}
