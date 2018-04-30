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


Route::group([ 'prefix' => 'room', 'middleware' => ['auth:api'] ], function ($router) {

    Route::get('/', 'RoomController@get');
    Route::post('create', 'RoomController@create');
    Route::post('join', 'RoomController@join');
    Route::post('leave', 'RoomController@leave');
    Route::get('messages', 'RoomController@fetchMessages');
    Route::post('message', 'RoomController@sendMessage');

});
