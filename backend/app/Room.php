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
 * @property bool                                                         $is_started
 * @property-read bool                                                    $is_full
 * @property int|null $black_player_id
 * @property int|null $white_player_id
 * @property-read \App\Player $blackPlayer
 * @property-read \App\Player $whitePlayer
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereBlackPlayerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Room whereWhitePlayerId($value)
 */
class Room extends Model
{
    public $timestamps = false;

    protected $fillable = [ 'name', 'is_started', 'black_player_id', 'white_player_id' ];

    protected $visible = [
        'id',
        'created_at',
        'name',
        'is_started',
        'is_full',

        'black_player_id',
        'white_player_id',

        'players',
        'messages',
    ];

    protected $appends = [ 'is_full' ];

    protected $casts = [
        'id' => 'integer',
        'black_player_id' => 'integer',
        'white_player_id' => 'integer',
        'is_full'    => 'boolean',
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

    public function blackPlayer()
    {
        return $this->hasOne(Player::class, 'black_player_id');
    }

    public function whitePlayer()
    {
        return $this->hasOne(Player::class, 'white_player_id');
    }

    /**
     * getIsFullAttribute method
     *
     * @return bool
     */
    public function getIsFullAttribute()
    {
        return $this->attributes[ 'is_full' ] = $this->players->count() > 1;
    }
}
