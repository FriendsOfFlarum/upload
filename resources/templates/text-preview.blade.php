@php
$translator = resolve('translator');
@endphp

<figure class="FofUpload-TextPreview" data-loading="false" data-expanded="false" data-hassnippet="{@has_snippet}">
    <figcaption class="FofUpload-TextPreviewTitle">
        <i aria-hidden="true" class="icon far fa-file"></i> {SIMPLETEXT1}
    </figcaption>

    <div class="FofUpload-TextPreviewSnippet">
      <pre><code data-preview-text="@php echo($translator->trans('fof-upload.forum.text_preview.no_snippet_preview')) @endphp" data-nosnippet-text="@php echo($translator->trans('fof-upload.forum.text_preview.no_snippet')) @endphp">{@snippet}</code></pre>
    </div>
    <div class="FofUpload-TextPreviewFull"></div>

    <button type="button" class="Button hasIcon FofUpload-TextPreviewToggle">
        <i aria-hidden="true" class="icon fas fa-chevron-down Button-icon FofUpload-TextPreviewExpandIcon"></i>
        <span class="Button-label FofUpload-TextPreviewExpand">
            @php echo($translator->trans('fof-upload.forum.text_preview.expand')); @endphp
        </span>

        <i aria-hidden="true" class="icon fas fa-chevron-up Button-icon FofUpload-TextPreviewCollapseIcon"></i>
        <span class="Button-label FofUpload-TextPreviewCollapse">
            @php echo($translator->trans('fof-upload.forum.text_preview.collapse')); @endphp
        </span>

        <div data-size="small" class="FofUpload-TextPreviewToggleLoading LoadingIndicator-container LoadingIndicator-container--inline LoadingIndicator-container--small">
          <div aria-hidden="true" class="LoadingIndicator"></div>
        </div>
    </button>

    <div class="FofUpload-TextPreviewError">
        <p>
            <i aria-hidden="true" class="icon fas fa-exclamation-circle"></i>
            @php echo($translator->trans('fof-upload.forum.text_preview.error')) @endphp
        </p>
    </div>

    <script>
        {
            const figure = document.currentScript.parentElement;

            const previewEl = figure.querySelector('.FofUpload-TextPreviewFull');
            const snippetEl = figure.querySelector('.FofUpload-TextPreviewSnippet');
            const loadingEl = figure.querySelector('.FofUpload-TextPreviewLoading');
            const toggleBtn = figure.querySelector('.FofUpload-TextPreviewToggle');

            const snippetText = '';

            const testUrl = new URL(location.origin);
            const url = new URL('{@url}');

            if (testUrl.origin !== url.origin) {
              // Prevent cross-origin requests
              handleError(new Error('Attempted to fetch a cross-origin file in text preview.'));
            }

            function createCodeHtml(text) {
                const codeEl = document.createElement('code');
                codeEl.innerText = text;

                return `<pre>${codeEl.outerHTML}</pre>`;
            }

            function handleError(e) {
                figure.setAttribute('data-error', 'true');

                console.group('[FoF Upload] Failed to preview text file.');
                console.error('Failed to load text file: ' + url);
                console.log(e);
                console.groupEnd();
            }

            let fileContent = null;

            // Only allow toggling preview if showing a snippet
            if ({@has_snippet} && testUrl.origin === url.origin) {
                toggleBtn.addEventListener('click', () => {
                    if (fileContent !== null) {
                        const expanded = figure.getAttribute('data-expanded') === 'true';
                        figure.setAttribute('data-expanded', !expanded);
                        return;
                    }

                    figure.setAttribute('data-loading', 'true');

                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                figure.setAttribute('data-loading', 'false');
                                throw response;
                            }

                            return response.text();
                        })
                        .then(text => {
                            fileContent = text;
                            previewEl.innerHTML = createCodeHtml(text);

                            figure.setAttribute('data-loading', 'false');
                            const expanded = figure.getAttribute('data-expanded') === 'true';
                            figure.setAttribute('data-expanded', !expanded);
                        })
                        .catch(handleError);
                });
            }
        }
    </script>
</figure>
