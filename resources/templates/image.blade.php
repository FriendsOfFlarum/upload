<div class="fof-download row" data-fof-upload-download-uuid="{@uuid}">
    <figure class="fof-upload-image">
        <img class="fof-upload-image-media" alt="" loading="lazy">
            <xsl:attribute name="src">
                <xsl:choose>
                    <xsl:when test="@thumbnail_url"><xsl:value-of select="@thumbnail_url"/></xsl:when>
                    <xsl:otherwise><xsl:value-of select="@url"/></xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:if test="@width and @height">
                <xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute>
                <xsl:attribute name="height"><xsl:value-of select="@height"/></xsl:attribute>
            </xsl:if>
        </img>
        <figcaption class="fof-upload-image-caption">
            <button type="button" class="Button hasIcon hasSubContent fof-upload-download-button">
                <i aria-hidden="true" class="icon fas fa-download Button-icon"></i>
                <span class="Button-label">
                    <span class="Button-labelText fof-upload-download-label">{TEXT1}</span>
                    <span class="Button-helperText fof-upload-download-size"><xsl:value-of select="@size"/></span>
                    <span class="Button-helperText fof-upload-download-reason"></span>
                </span>
            </button>
        </figcaption>
    </figure>
</div>
