<?php

namespace App\Exceptions;

class EmptyCartException extends \Exception
{
    /**
     * Create a new exception instance.
     */
    public function __construct(string $message = 'The cart is empty.')
    {
        parent::__construct($message);
    }
}
