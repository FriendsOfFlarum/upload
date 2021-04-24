<?php


namespace FoF\Upload\Adapters;


use ExerciseBook\Flysystem\ImageX\ImageXAdapter;
use ExerciseBook\Flysystem\ImageX\ImageXConfig;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use Illuminate\Support\Str;
use League\Flysystem\Config;

class ImageX extends Flysystem implements UploadAdapter
{
    /**
     * @var string Resources uri Prefix
     */
    private $uriPrefix;

    /**
     * @var ImageXConfig ImageX Client Settings
     */
    private $config;

    /**
     * @var array ImageX Client Settings
     */
    private $arrConfig;

    public function __construct($config)
    {
        parent::__construct(new ImageXAdapter($config));

        // Save config
        $this->config = new ImageXConfig();

        $this->config->region = $config["region"];
        $this->config->accessKey = $config["access_key"];
        $this->config->secretKey = $config["secret_key"];
        $this->config->serviceId = $config["service_id"];
        $this->config->domain = $config["domain"];

        $this->arrConfig = $config;
        $this->uriPrefix = $this->adapter->imageXBuildUriPrefix();
    }

    protected function getConfig()
    {
        return new Config($this->arrConfig);
    }

    protected function generateUrl(File $file)
    {
        $type = mb_strtolower($file->type);
        $path = $file->getAttribute('path');
        $template = $this->arrConfig["template"];

        if (Str::startsWith($type, "image/") && $template) {
            $url = '//' . $this->config->domain . '/' . $this->uriPrefix . '/' . $path . '~' . $template . '.image';
        } else {
            $url = '//' . $this->config->domain . '/' . $this->uriPrefix . '/' . $path;
        }
        $file->url = $url;
    }
}
