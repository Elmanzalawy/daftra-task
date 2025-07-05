<?php

namespace App\Listeners;

use App\Events\OrderCreated;

class SendConfirmationEmail
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        // email logic goes here..
    }
}
