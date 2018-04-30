<?php

namespace App\Events;

class GameCreated extends Event
{
    public $remotePlayer;

    public function __construct($remotePlayer)
    {
        $this->remotePlayer = $remotePlayer;
    }
}
