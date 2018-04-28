<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Message
 *
 * @property-read \App\Player $player
 * @property-read \App\Room $room
 * @mixin \Eloquent
 * @property int $id
 * @property string $message
 * @property int $player_id
 * @property int $room_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message wherePlayerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Message whereUpdatedAt($value)
 */
class Message extends Model
{
    protected $fillable = [ 'message', 'player_id', 'room_id' ];

    protected $visible = [ 'id', 'created_at', 'message', 'player_id', 'room_id' ];

    public function player()
    {
        return $this->hasOne(Player::class);
    }

    public function room()
    {
        return $this->hasOne(Room::class);
    }
}
