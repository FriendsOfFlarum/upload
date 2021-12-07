@php
$translator = resolve('translator');
@endphp

<figure class="FofUpload-TextPreview" data-loading="true" data-expanded="false" data-hassnippet="false">
    <figcaption class="FofUpload-TextPreviewTitle">
        <i aria-hidden="true" class="icon far fa-file"></i> {SIMPLETEXT1}
    </figcaption>

    <div class="FofUpload-TextPreviewLoading">
        <div data-size="medium" class="LoadingIndicator-container">
            <div aria-hidden="true" class="LoadingIndicator"></div>
        </div>
    </div>

    <div class="FofUpload-TextPreviewSnippet"></div>
    <div class="FofUpload-TextPreviewFull"></div>

    <button type="button" class="Button hasIcon FofUpload-TextPreviewToggle">
        <i aria-hidden="true" class="icon fas fa-chevron-down Button-icon FofUpload-TextPreviewExpandIcon"></i>
        <span class="Button-label FofUpload-TextPreviewExpand">
            @php echo($translator->trans('fof-upload.ref.text_preview.expand')); @endphp
        </span>

        <i aria-hidden="true" class="icon fas fa-chevron-up Button-icon FofUpload-TextPreviewCollapseIcon"></i>
        <span class="Button-label FofUpload-TextPreviewCollapse">
            @php echo($translator->trans('fof-upload.ref.text_preview.collapse')); @endphp
        </span>
    </button>

    <div class="FofUpload-TextPreviewError">
        <p>
            <i aria-hidden="true" class="icon fas fa-exclamation-circle"></i>
            @php echo($translator->trans('fof-upload.ref.text_preview.error')) @endphp
        </p>
    </div>

    <script>
        {
            const figure = document.currentScript.parentElement;

            function createCodeHtml(text) {
                const codeEl = document.createElement('code');
                codeEl.innerText = text;

                return `<pre>${codeEl.outerHTML}</pre>`;
            }

            function handleError(e) {
                figure.setAttribute('data-error', 'true');

                console.group('[FoF Upload] Failed to preview text file.');
                console.error('Failed to load text file: {@url}');
                console.log(e);
                console.groupEnd();
            }

            fetch('{@url}')
                .then(response => {
                    if (!response.ok) {
                        figure.setAttribute('data-loading', 'false');
                        throw response;
                    }

                    return response.text();
                })
                .then(text => {
                    const previewEl = figure.querySelector('.FofUpload-TextPreviewFull');
                    const snippetEl = figure.querySelector('.FofUpload-TextPreviewSnippet');
                    const loadingEl = figure.querySelector('.FofUpload-TextPreviewLoading');
                    const toggleBtn = figure.querySelector('.FofUpload-TextPreviewToggle');

                    const previewText = text.split('\n').slice(0, 5).join('\n');
                    const snippetNeeded = previewText.length !== text.length;
                    
                    if (snippetNeeded) {
                        snippetEl.innerHTML = createCodeHtml(previewText);
                        figure.setAttribute('data-hassnippet', 'true');

                        toggleBtn.addEventListener('click', () => {
                            const expanded = figure.getAttribute('data-expanded') === 'true';
                            figure.setAttribute('data-expanded', !expanded);
                        });
                    }

                    previewEl.innerHTML = createCodeHtml(text);

                    figure.setAttribute('data-loading', 'false');
                })
                .catch(handleError);
        }
    </script>
</figure>