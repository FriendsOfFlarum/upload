public function template(): string
{
    return app('view')->make('fof-upload::templates.video', [
        'url' => $this->url // 这里把 PHP 的变量传给 Blade
    ])->render();
}
