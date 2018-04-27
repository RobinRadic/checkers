<?php

namespace App\Events;

class PieceMoved extends GameEvent
{
    /** @var array */
    public $from;

    /** @var array */
    public $to;

    /**
     * Create a new event instance.
     *
     * @param array $from = ['row'=>1,'col'=>1]
     * @param array $to   = ['row'=>1,'col'=>1]
     */
    public function __construct(array $from, array $to)
    {
        //
        $this->from = $from;
        $this->to   = $to;
    }
}
