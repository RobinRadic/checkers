<?php

namespace App\Events;

class PlayerJoined extends GameEvent
{
    public $player;

    /**
     * PlayerJoined constructor.
     *
     * @param $player
     */
    public function __construct($player)
    {
        $this->player = $player;
    }


}
