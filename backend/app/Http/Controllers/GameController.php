<?php

namespace App\Http\Controllers;

use App\Events\GameCreated;
use App\Events\GameStarted;
use App\Events\MessageSent;
use App\Events\PieceMoved;
use App\Events\PlayerJoined;
use App\Message;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function createGame(Request $request)
    {
        $remotePlayer = $request->input('remotePlayer');
        broadcast(new GameCreated($remotePlayer))->toOthers();
    }

    public function startGame(Request $request)
    {
//        $remotePlayer = $request->input('remotePlayer');
        broadcast(new GameStarted())->toOthers();
    }

    public function playerJoin(Request $request)
    {
        $player = $request->input('player');
        broadcast(new PlayerJoined($player))->toOthers();
    }

    public function fetchMessages()
    {
        $messages = Message::all(['created_at', 'id','message','sender_name'])
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
    public function sendMessage(Request $request)
    {
        $message = Message::create([
            'message'     => $request->input('message'),
            'sender_name' => $request->input('name'),
            'sender_ip'   => $request->ip(),
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([ 'status' => 'Message Sent!' ]);
    }

    public function movePiece(Request $request)
    {
        $from = $request->input('from');
        $to   = $request->input('to');

        broadcast(new PieceMoved($from, $to))->toOthers();

        return response()->json([ 'status' => 'Move send!' ]);
    }
}
