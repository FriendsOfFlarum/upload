export default class DragAndDrop {
  private upload: (files: FileList) => void;
  private composerElement: Element;
  private over = false;
  private handlers: {
    in?: (event: DragEvent) => void;
    out?: (event: DragEvent) => void;
    dropping?: (event: DragEvent) => void;
  } = {};

  constructor(upload: (files: FileList) => void, composerElement: Element) {
    this.upload = upload;
    this.composerElement = composerElement;

    if (!this.supportsFileDragging()) {
      return;
    }

    this.composerElement.addEventListener('dragover', (this.handlers.in = this.in.bind(this)) as EventListener);
    this.composerElement.addEventListener('dragleave', (this.handlers.out = this.out.bind(this)) as EventListener);
    this.composerElement.addEventListener('dragend', this.handlers.out as EventListener);
    this.composerElement.addEventListener('drop', (this.handlers.dropping = this.dropping.bind(this)) as EventListener);
  }

  supportsFileDragging(): boolean {
    const div = document.createElement('div');
    return (
      ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
      'FormData' in window &&
      'FileReader' in window
    );
  }

  unload(): void {
    if (!this.handlers.in) {
      return;
    }

    this.composerElement.removeEventListener('dragover', this.handlers.in as EventListener);
    this.composerElement.removeEventListener('dragleave', this.handlers.out! as EventListener);
    this.composerElement.removeEventListener('dragend', this.handlers.out! as EventListener);
    this.composerElement.removeEventListener('drop', this.handlers.dropping! as EventListener);
  }

  isNotFile(event: DragEvent): boolean {
    if (event.dataTransfer?.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind !== 'file') {
          return true;
        }
      }
    }
    return false;
  }

  in(event: DragEvent): void {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (!this.over) {
      this.composerElement.classList.add('fof-upload-dragging');
      this.over = true;
    }
  }

  out(event: DragEvent): void {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (this.over) {
      this.composerElement.classList.remove('fof-upload-dragging');
      this.over = false;
    }
  }

  dropping(event: DragEvent): void {
    if (this.isNotFile(event) || !event.dataTransfer?.files) {
      return;
    }
    event.preventDefault();
    this.upload(event.dataTransfer.files);
    this.composerElement.classList.remove('fof-upload-dragging');
  }
}
