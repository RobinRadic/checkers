<?php

namespace App\Events;

class GameCreated extends GameEvent
{
    public $remotePlayer;

    public function __construct($remotePlayer)
    {
        $this->remotePlayer = $remotePlayer;
    }
}
