<?php

namespace App\Console\Commands;

use App\Events\RoomCreated;
use App\Room;
use App\User;
use Illuminate\Console\Command;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){
        $user     = User::get()->first();
        $player   = $user->player;
        $room     = $player->room()->getRelation();
        $room->messages()->getRelation('messages')->limit(10);
        $messages = $room->messages;
        $room = Room::whereName('my room')
            ->withLatestMessages()
            ->get()
            ->first();
        /** @var \Illuminate\Database\Eloquent\Collection $messages */
//        $messages = $room->messages->take(10);
//        $messages->load(['player']);
//        $room->setRelation('messages', $room->messages->take(10)->load('player'));
        $data = $room->toArray();
        $a = 'a';
    }

    public function handle2()
    {
        broadcast(new RoomCreated(Room::get()->first()));
    }
}
