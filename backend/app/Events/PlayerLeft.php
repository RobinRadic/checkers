<?php

namespace App\Events;

class PlayerLeft  extends Event
{
    /** @var \App\Player */
    public $player;

    /** @var \App\Room */
    public $room;

    /**
     * PlayerJoined constructor.
     *
     * @param \App\Player $player
     * @param \App\Room   $room
     */
    public function __construct(\App\Player $player, \App\Room $room)
    {
        $this->player = $player;
        $this->room   = $room;
    }


}
