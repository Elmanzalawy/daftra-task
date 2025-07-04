<?php

namespace App\Exceptions;

class ProductUnavailableException extends \Exception
{
    /**
     * Create a new exception instance.
     */
    public function __construct(string $message = 'Product is unavailable.')
    {
        parent::__construct($message);
    }
}
