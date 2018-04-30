<?php

namespace App\Observer;

use App\Player;
use App\User;

class UserObserver
{
    public function created(User $user)
    {
        Player::create([ 'ip' => request()->ip(), 'user_id' => $user->id ]);
    }

}
