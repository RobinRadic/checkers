<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
//        $this->call(PlayersTableSeeder::class);
//        $this->call(RoomsTableSeeder::class);
//        $this->call(MessagesTableSeeder::class);

//        $room       = new \App\Room();
//        $room->name = 'my room';

        $room   = \App\Room::create([ 'name' => 'my room' ]);
        $playerJim = \App\Player::create([ 'name' => 'Jim', 'ip' => '0.0.0.0', 'room_id' => $room->id ]);

    }
}
