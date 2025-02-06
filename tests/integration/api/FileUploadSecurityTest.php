<?php

namespace FoF\Upload\Tests\integration\api;

use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\Tests\EnhancedTestCase;

class FileUploadSecurityTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
        ]);
    }

    protected function giveNormalUserUploadPermission()
    {
        $this->prepareDatabase([
            'group_permission' => [
                ['group_id' => 3, 'permission' => 'fof-upload.upload'],
                ['group_id' => 3, 'permission' => 'fof-upload.download'],
            ],
        ]);
    }

    protected function addType(string $mime, string $adapter = 'local', string $template = 'just-url')
    {
        $this->setting('fof-upload.mimeTypes', json_encode([
            $mime => [
                'adapter'   => $adapter,
                'template'  => $template,
            ],
        ]));
    }

    /**
     * @test
     */
    public function user_with_permission_can_upload_svg_containing_malicious_content_and_is_sanitized()
    {
        $this->giveNormalUserUploadPermission();
        //$this->addType('image\/svg+xml');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Malicious.svg')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $pathToFile = $json['data'][0]['attributes']['path'];
        $this->assertNotEmpty($pathToFile);

        $file_contents = file_get_contents(resolve(Paths::class)->public.'/assets/files/'.$pathToFile);

        $this->assertNotEmpty($file_contents);

        $this->assertStringNotContainsString('<script', $file_contents);
    }

    /**
     * @test
     */
    public function user_with_permission_can_upload_an_svg_if_safe()
    {
        $this->giveNormalUserUploadPermission();
        //$this->addType('image\/svg+xml');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Safe.svg')),
                ],
            ])
        );

        if ($response->getStatusCode() !== 200) {
            $json = json_decode($response->getBody()->getContents(), true);
            print_r($json);
        }

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_cannot_upload_a_non_image_disguised_as_an_image()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('TextFileWithPngExtension.png')),
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('validation_error', $json['errors'][0]['code']);
    }

    /**
     * @test
     */
    public function user_with_permission_cannot_upload_a_mime_spoofed_file()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('SpoofedMime.png')),
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('validation_error', $json['errors'][0]['code']);
    }
}
