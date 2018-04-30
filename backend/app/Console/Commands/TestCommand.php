<?php

namespace App\Console\Commands;

use App\Events\RoomCreated;
use App\Room;
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
        $room = Room::get()->first();
        broadcast(new RoomCreated($room));
    }

    public function handle2()
    {
        broadcast(new RoomCreated(Room::get()->first()));
    }
}
