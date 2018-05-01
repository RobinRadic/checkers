<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\PlayerJoined;
use App\Events\PlayerLeft;
use App\Events\RoomCreated;
use App\Message;
use App\Room;
use App\User;
use Illuminate\Http\Response;
use Validator;

/**
 * This is the class RoomController.
 *
 * @package App\Http\Controllers
 * @author  Robin Radic
 */
class RoomController extends Controller
{
    /**
     * get a list of all rooms
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndex()
    {
        return response()->json(Room::all());
    }

    /**
     * create a new room and join it with the user/player
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCreate()
    {
        $validator = Validator::make($data = request()->only('name'), [
            'name' => 'string|min:1|max:200|unique:rooms,name',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid room data',
                'errors'  => $validator->messages()->toArray(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        /** @var User $user */
        $user   = auth()->user();
        $player = $user->player;

        if ($player->inRoom()) {
            broadcast(new PlayerLeft($user->player, $user->player->room));
            $player->leaveRoom(); // not needed as joinRoom is called
        }

        $room = Room::create($data);
        $player->joinRoom($room)->save();
        broadcast(new RoomCreated($room));
        broadcast(new PlayerJoined($user->player, $room));
        return response()->json($room);
    }

    /**
     * leave the current user/player current room
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function postLeave()
    {
        /** @var User $user */
        $user   = auth()->user();
        $player = $user->player;

        if ($player->inRoom()) {
            $player->leaveRoom()->save();
            broadcast(new PlayerLeft($player, $player->room));
        }
        return response()->json([ 'message', 'Room left' ]);
    }

    /**
     * get messages for the logged in user/player its current room
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMessages()
    {
        /** @var User $user */
        $user   = auth()->user();
        $player = $user->player;
        $room   = $player->room()->getRelation();
        $room->messages()->getRelation('messages')->limit(10);
        $messages = $room->messages;

        return response()->json($messages);
    }

    /**
     * add a message by the logged in user/player in its current room
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function postMessage()
    {
        // @todo: update
        $message = Message::create([
            'message'     => request()->input('message'),
            'sender_name' => request()->input('name'),
            'sender_ip'   => request()->ip(),
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([ 'status' => 'Message Sent!' ]);
    }

    /**
     * get a single room rooms
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function get($id)
    {
        $room = Room::withLatestMessages()->find($id);

        if ($room === null) {
            return response()->json([ 'message' => 'Room does not exist' ], Response::HTTP_BAD_REQUEST);
        }
        return response()->json($room);
    }

    /**
     * join a room with the current user/player
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function postJoin($id)
    {
        $room = Room::withLatestMessages()->find($id);

        if ($room === null) {
            return response()->json([ 'message' => 'Room does not exist' ], Response::HTTP_BAD_REQUEST);
        }

        /** @var User $user */
        $user = auth()->user();
        $user->player->joinRoom($room)->save();
        broadcast(new PlayerJoined($user->player, $room));
        return response()->json($room);
    }
}
