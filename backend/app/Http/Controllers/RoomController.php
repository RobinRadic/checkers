<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\PlayerJoined;
use App\Events\PlayerLeft;
use App\Events\RoomCreated;
use App\Message;
use App\Room;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;

class RoomController extends Controller
{
    public function create()
    {
        $validator = Validator::make($data = request()->only('name'), [
            'name' => 'string|min:1|max:200|unique:rooms,name',
        ]);
        if ($validator->fails()) {
            return response()->json([ 'message' => 'Invalid room data', 'errors' => $validator->messages()->toArray() ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $user = User::find(auth()->id());
        if ($user->player->inRoom()) {
            broadcast(new PlayerLeft($user->player, $user->player->room));
        }
        $room = Room::create($data);
        $user->player->joinRoom($room)->save();
//        $user->player->update([ 'room_id' => $room->id ]);
        broadcast(new RoomCreated($room));
        broadcast(new PlayerJoined($user->player, $room));
        return response()->json($room);
    }

    public function join()
    {
        $room = Room::whereName(request([ 'name' ]))->first();
        if ($room === null) {
            return response()->json([ 'message' => 'Room does not exist' ], Response::HTTP_BAD_REQUEST);
        }
        $user = User::find(auth()->id());
        $user->player->joinRoom($room)->save();
        broadcast(new PlayerJoined($user->player, $room));
//        $user->player->update([ 'room_id' => $room->id ]);
        return response()->json($room);
    }

    public function leave()
    {
        $user   = User::find(auth()->id());
        $player = $user->player;

        if ($player->inRoom()) {
            $room = $player->room;
            $player
                ->leaveRoom()
                ->save();
            broadcast(new PlayerLeft($player, $room));
        }
        return response()->json([ 'message', 'Room left' ]);
    }

    public function get()
    {
        $room = Room::whereName(request([ 'name' ]))->with([ 'players', 'messages', 'messages.player' ])->first();
        if ($room === null) {
            return response()->json([ 'message' => 'Room does not exist' ], Response::HTTP_BAD_REQUEST);
        }
        return response()->json($room);
    }

    public function fetchMessages($roomId)
    {
        $messages = Message::all([ 'created_at', 'id', 'message', 'sender_name' ])
            ->reverse()
            ->slice(0, 10)
            ->reverse()
            ->values()
            ->toArray();

        return response()->json($messages);
    }

    /**
     * sendMessage method
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function sendMessage(Request $request, $roomId)
    {
        $message = Message::create([
            'message'     => $request->input('message'),
            'sender_name' => $request->input('name'),
            'sender_ip'   => $request->ip(),
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([ 'status' => 'Message Sent!' ]);
    }

}
