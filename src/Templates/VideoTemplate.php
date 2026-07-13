public function template(): string
{
    return app('view')->make('fof-upload::templates.video', [
        'url' => $this->url 
    ])->render();
}
