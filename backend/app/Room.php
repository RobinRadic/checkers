<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Room
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Message[] $messages
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Player[]  $players
 * @mixin \Eloquent
 * @property int                                                          $id
 * @property string                                                       $name
 * @property \Carbon\Carbon|null                                          $created_at
 * @property \Carbon\Carbon|null                                          $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereIsFull($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereIsStarted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereUpdatedAt($value)
 * @property bool $is_started
 * @property-read bool $is_full
 */
class Room extends Model
{
    protected $fillable = [ 'name', 'is_started' ];

    protected $visible = [ 'id', 'created_at', 'name', 'is_started', 'is_full' ];

    protected $casts = [
        'is_full' => 'boolean',
        'is_started' => 'boolean',
    ];

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * getIsFullAttribute method
     *
     * @return bool
     */
    public function getIsFullAttribute()
    {
        return $this->players->count() > 1;
    }
}
