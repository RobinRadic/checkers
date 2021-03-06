<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Player
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Message[] $messages
 * @property-read \App\Room                                               $room
 * @mixin \Eloquent
 * @property int                                                          $id
 * @property string                                                       $name
 * @property string                                                       $ip
 * @property int|null                                                     $room_id
 * @property \Carbon\Carbon|null                                          $created_at
 * @property \Carbon\Carbon|null                                          $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereUpdatedAt($value)
 * @property int                                                          $user_id
 * @property-read \App\User                                               $user
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Player whereUserId($value)
 */
class Player extends Model
{
    public $timestamps = false;

    protected $fillable = [ 'ip', 'room_id', 'user_id' ];

    protected $visible = [
        'id',
        'room_id',

        'name',

        'room',
        'messages'
    ];

    protected $casts = [
        'id'      => 'integer',
        'room_id' => 'integer',
        'user_id' => 'integer',
    ];

    protected $appends = [
        'name'
    ];


    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * getIsFullAttribute method
     *
     * @return bool
     */
    public function getNameAttribute()
    {
        return $this->attributes[ 'name' ] = $this->user->name;
    }

    public function inRoom()
    {
        return $this->room_id !== null;
    }

    public function leaveRoom()
    {
        $this->room_id = null;
        return $this;
    }

    /**
     * joinRoom method
     *
     * @param int|Room $room
     *
     * @return $this
     */
    public function joinRoom($room)
    {
        if ($room instanceof Room) {
            $room = $room->id;
        }
        $this->room_id = $room;
        return $this;
    }
}
