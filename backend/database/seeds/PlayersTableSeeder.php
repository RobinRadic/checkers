<?php

use Illuminate\Database\Seeder;

class PlayersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $table = DB::table('players');
        $table->insert([
            'name' => 'Jim',
            'ip'   => '0.0.0.0',
        ]);
    }
}
