<?php

namespace App\Events;

class RoomCreated extends Event
{
    /** @var \App\Room */
    public $room;

    /**
     * RoomCreated constructor.
     *
     * @param \App\Room $room
     */
    public function __construct(\App\Room $room)
    {
        $this->room = $room;
    }

}
