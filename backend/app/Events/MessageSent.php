<?php

namespace App\Events;

use App\Message;

class MessageSent extends GameEvent
{
    /** @var \App\Message */
    public $message;

    /**
     * Create a new event instance.
     *
     * @param \App\Message $message
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

}
