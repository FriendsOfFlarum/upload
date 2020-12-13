<?php

namespace FoF\Upload\Listeners;

use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Helpers\Settings;

class AddAvailableOptionsInAdmin
{
    /**
     * @var Settings
     */
    protected $settings;

    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    public function handle(Deserializing $event)
    {
        $event->settings['fof-upload.availableUploadMethods'] = $this->settings->getAvailableUploadMethods()->toArray();
        $event->settings['fof-upload.availableTemplates'] = $this->settings->getAvailableTemplates()->toArray();
    }
}
