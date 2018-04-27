<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MovedPiece implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

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

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('game');
    }
}
