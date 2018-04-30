<?php

use App\Message;
use App\Player;
use App\Room;
use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /** @var Faker\Generator */
    protected $faker;

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->faker = $this->container->make(Faker\Generator::class);

        $userTest = $this->createUser('test@test.com', null, 'Tester');

        $room    = $this->createRoom('my room');
        $userJim = $this->createUser('jim@test.com', $room, 'Jim');
        $this->createMessages($userJim, $room);

        $room2   = $this->createRoom('my second room');
        $userBob = $this->createUser('bob@test.com', $room2, 'Bob');
        $userFoo = $this->createUser('foo@test.com', $room2, 'Foo');
        $this->createMessages($userBob, $room2);
        $this->createMessages($userFoo, $room2, 1);
        $this->createMessages($userBob, $room2, 2);
        $this->createMessages($userFoo, $room2);
    }

    /**
     * @param string             $email
     * @param \App\Room|int|null $room
     *
     * @param string             $name
     *
     * @return User
     */
    protected function createUser(string $email, $room, string $name = null)
    {
        if ($room instanceof Room) {
            $room = $room->id;
        }

        $name     = $name ?: $this->faker->name;
        $password = app()->make('hash.driver')->make('test');
        $user     = User::create(compact('email', 'name', 'password'));
        $player   = Player::create([ 'ip' => '0.0.0.0', 'room_id' => $room, 'user_id' => $user->id ]);

        return $user;
    }

    /**
     * createMessages method
     *
     * @param Player|User $player
     * @param \App\Room   $room
     * @param int         $count
     *
     * @return mixed
     */
    protected function createMessages($player, Room $room, int $count = 3)
    {
        if ($player instanceof User) {
            $player = $player->player;
        }
        return factory(Message::class, $count)->create([
            'player_id' => $player->id,
            'room_id'   => $room->id,
        ]);
    }

    /**
     * createRoom method
     *
     * @param string $name
     *
     * @return Room
     */
    protected function createRoom(string $name)
    {
        return Room::create(compact('name'));
    }
}
