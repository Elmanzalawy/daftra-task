<?php

namespace App\Exceptions;

class ProductOutOfStockException extends \Exception
{
    /**
     * Create a new exception instance.
     *
     * @param string $message
     */
    public function __construct(string $message = 'Product is out of stock.')
    {
        parent::__construct($message);
    }
}