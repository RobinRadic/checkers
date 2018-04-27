<?php

namespace App\Http\Controllers;

use App\Events\MovedPiece;
use Illuminate\Http\Request;

class GameController extends Controller
{

    public function movePiece(Request $request)
    {
        $from = $request->input('from');
        $to   = $request->input('to');

        broadcast(new MovedPiece($from, $to))->toOthers();

        return response()->json([ 'status' => 'Move send!' ]);
    }
}
