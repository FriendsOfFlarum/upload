@php
$translator = resolve('translator');
@endphp
<figure class="FofUpload-TextPreview" data-loading="false" data-expanded="false" data-hassnippet="{@has_snippet}">
    <figcaption class="FofUpload-TextPreviewTitle">
        <i aria-hidden="true" class="icon far fa-file"></i> <span class="FofUpload-TextPreviewLabel">{TEXT1}</span>
    </figcaption>

    <xsl:choose>
        <xsl:when test="@snippet != ''">
            <div class="FofUpload-TextPreviewSnippet"><pre><code><xsl:value-of select="@snippet"/></code></pre></div>
        </xsl:when>
        <xsl:otherwise>
            <p class="helpText FofUpload-TextPreviewEmpty">
                <xsl:choose>
                    <xsl:when test="@empty_text"><xsl:value-of select="@empty_text"/></xsl:when>
                    <xsl:otherwise>{{ $translator->trans('fof-upload.forum.text_preview.no_snippet_preview') }}</xsl:otherwise>
                </xsl:choose>
            </p>
        </xsl:otherwise>
    </xsl:choose>

    <div class="FofUpload-TextPreviewFull"></div>
    <p class="FofUpload-TextPreviewError" role="status"></p>

    <xsl:if test="@download_text">
        <div class="FofUpload-TextPreviewControls">
            <xsl:if test="@expandable = 'true'">
                <button type="button" class="Button hasIcon FofUpload-TextPreviewToggle" aria-expanded="false" data-url="{@url}">
                    <i aria-hidden="true" class="icon fas fa-chevron-down Button-icon FofUpload-TextPreviewExpandIcon"></i>
                    <i aria-hidden="true" class="icon fas fa-chevron-up Button-icon FofUpload-TextPreviewCollapseIcon"></i>
                    <span class="Button-label">
                        <span class="Button-labelText FofUpload-TextPreviewExpand"><xsl:value-of select="@expand_text"/></span>
                        <span class="Button-labelText FofUpload-TextPreviewCollapse"><xsl:value-of select="@collapse_text"/></span>
                    </span>
                    <span aria-hidden="true" class="LoadingIndicator-container LoadingIndicator-container--inline LoadingIndicator-container--small FofUpload-TextPreviewToggleLoading" data-size="small"><span class="LoadingIndicator"></span></span>
                </button>
            </xsl:if>
            <button type="button" class="Button hasIcon FofUpload-TextPreviewDownload" data-fof-upload-download-uuid="{@uuid}">
                <i aria-hidden="true" class="icon fas fa-download Button-icon"></i>
                <span class="Button-label">
                    <span class="Button-labelText"><xsl:value-of select="@download_text"/></span>
                    <span class="Button-helperText fof-upload-download-reason"></span>
                </span>
            </button>
        </div>
    </xsl:if>
</figure>
