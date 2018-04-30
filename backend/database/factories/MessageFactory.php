<?php

use Faker\Generator as Faker;

$factory->define(App\Message::class, function (Faker $faker) {
    return [
        'message' => $faker->sentences(random_int(1,5), true)
    ];
});
