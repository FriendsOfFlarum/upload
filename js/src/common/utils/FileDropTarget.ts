export interface FileDropTargetOptions {
  // A refused drop is still kept from the browser, so it never opens the file.
  accepts?: () => boolean;
}

export default class FileDropTarget {
  private upload: (files: FileList) => void;
  private element: Element;
  private accepts: () => boolean;
  private depth = 0;

  private readonly onEnter = (event: Event) => this.enter(event as DragEvent);
  private readonly onOver = (event: Event) => this.over(event as DragEvent);
  private readonly onLeave = (event: Event) => this.leave(event as DragEvent);
  private readonly onDrop = (event: Event) => this.drop(event as DragEvent);

  constructor(upload: (files: FileList) => void, element: Element, options: FileDropTargetOptions = {}) {
    this.upload = upload;
    this.element = element;
    this.accepts = options.accepts ?? (() => true);

    element.addEventListener('dragenter', this.onEnter);
    element.addEventListener('dragover', this.onOver);
    element.addEventListener('dragleave', this.onLeave);
    element.addEventListener('drop', this.onDrop);
  }

  unload(): void {
    this.element.removeEventListener('dragenter', this.onEnter);
    this.element.removeEventListener('dragover', this.onOver);
    this.element.removeEventListener('dragleave', this.onLeave);
    this.element.removeEventListener('drop', this.onDrop);
    this.reset();
  }

  isFileDrag(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files');
  }

  // dragenter and dragleave fire for every child crossed, so only the outermost pair counts.
  private enter(event: DragEvent): void {
    if (!this.isFileDrag(event)) return;

    event.preventDefault();

    if (this.depth++ === 0 && this.accepts()) this.element.classList.add('fof-upload-dragging');
  }

  private over(event: DragEvent): void {
    if (!this.isFileDrag(event)) return;

    event.preventDefault();

    if (event.dataTransfer) event.dataTransfer.dropEffect = this.accepts() ? 'copy' : 'none';
  }

  private leave(event: DragEvent): void {
    if (!this.isFileDrag(event)) return;

    if (--this.depth <= 0) this.reset();
  }

  private drop(event: DragEvent): void {
    if (!this.isFileDrag(event)) return;

    event.preventDefault();
    this.reset();

    const files = event.dataTransfer?.files;

    if (files?.length && this.accepts()) this.upload(files);
  }

  private reset(): void {
    this.depth = 0;
    this.element.classList.remove('fof-upload-dragging');
  }
}
