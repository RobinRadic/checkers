<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function fetchMessages()
    {
        return Message::all()->reverse()->slice(0, 10)->reverse();
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

        return response()->json(['status' => 'Message Sent!']);

    }
}
