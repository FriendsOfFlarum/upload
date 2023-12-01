<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Templates;

use FoF\Upload\Contracts\Template;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Symfony\Contracts\Translation\TranslatorInterface;

abstract class AbstractTemplate implements Template
{
    /**
     * @var string
     */
    protected $tag;

    public function __construct(
        protected Factory $viewFactory,
        protected TranslatorInterface $translator
    ) {
    }

    public function tag(): string
    {
        return $this->tag;
    }

    protected function getView(string $view, array $arguments = []): View
    {
        return $this->viewFactory->make($view, $arguments);
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans($key, $params);
    }
}
