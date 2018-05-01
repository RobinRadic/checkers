<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([ 'prefix' => 'auth' ], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('register', 'AuthController@register');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::get('me', 'AuthController@me');
});



Route::group([ 'prefix' => 'room', 'middleware' => [ 'auth:api' ] ], function ($router) {

    Route::get('/', 'RoomController@getIndex');
    Route::post('/', 'RoomController@postCreate');

    // first matching route will be used
    Route::post('leave', 'RoomController@postLeave');
    Route::get('message', 'RoomController@getMessages');
    Route::post('message', 'RoomController@postMessage');

    Route::get('{id}', 'RoomController@get');
    Route::post('{id}/join', 'RoomController@postJoin');

});
