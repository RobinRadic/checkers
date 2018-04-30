<?php

namespace App\Console\Commands;

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
        $this->info(csrf_token());
    }

    public function handle2()
    {
        /** @var Room $room */
        $room = Room::with([ 'players', 'messages', 'messages.player' ])->whereKey(1)->first();
        /** @var Room $room2 */
        $room2 = Room::with([ 'players', 'messages', 'messages.player' ])->whereKey(2)->first();


        $rooms = collect([ $room, $room2 ])->toArray();

        $a = 'a';
    }
}
