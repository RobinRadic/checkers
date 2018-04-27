<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::group([ 'prefix' => 'game'], function () {
    Route::post('move', 'GameController@movePiece');
    Route::post('create', 'GameController@createGame');
    Route::get('messages', 'GameController@fetchMessages');
    Route::post('messages', 'GameController@sendMessage');
});
