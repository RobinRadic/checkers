<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Player
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Message[] $messages
 * @property-read \App\Room $room
 * @mixin \Eloquent
 * @property int $id
 * @property string $name
 * @property string $ip
 * @property int|null $room_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereUpdatedAt($value)
 */
class Player extends Model
{
    protected $fillable = [ 'name', 'ip', 'room_id' ];

    protected $visible = [ 'id', 'created_at', 'name', 'room_id' ];

    public function room()
    {
        return $this->hasOne(Room::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}