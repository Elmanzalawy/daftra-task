<?php

namespace App\Exceptions;

class ProductNotFoundException extends \Exception
{
    /**
     * Create a new exception instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Product not found.')
    {
        parent::__construct($message);
    }
}