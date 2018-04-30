<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function create(Request $request)
    {

    }

    public function join(Request $request)
    {

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
