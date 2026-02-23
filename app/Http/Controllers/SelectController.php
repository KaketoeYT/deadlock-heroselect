<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SelectController extends Controller
{
    public function index() {
        $heroes = [
            (object)['name' => 'abrams'],
            (object)['name' => 'apollo'],
            (object)['name' => 'bebop'],
            (object)['name' => 'billy'],
            (object)['name' => 'calico'],
            (object)['name' => 'celeste'],
            (object)['name' => 'doorman'],
            (object)['name' => 'drifter'],
            (object)['name' => 'dynamo'],
            (object)['name' => 'graves'],
            (object)['name' => 'greytalon'],
            (object)['name' => 'haze'],
            (object)['name' => 'holliday'],
            (object)['name' => 'infernus'],
            (object)['name' => 'ivy'],
            (object)['name' => 'kelvin'],
            (object)['name' => 'ladygeist'],
            (object)['name' => 'lash'],
            (object)['name' => 'mcginnis'],
            (object)['name' => 'mina'],
            (object)['name' => 'mirage'],
            (object)['name' => 'mokrill'],
            (object)['name' => 'paige'],
            (object)['name' => 'paradox'],
            (object)['name' => 'pocket'],
            (object)['name' => 'rem'],
            (object)['name' => 'seven'],
            (object)['name' => 'shiv'],
            (object)['name' => 'silver'],
            (object)['name' => 'sinclair'],
            (object)['name' => 'venator'],
            (object)['name' => 'victor'],
            (object)['name' => 'vindicta'],
            (object)['name' => 'viscous'],
            (object)['name' => 'vyper'],
            (object)['name' => 'warden'],
            (object)['name' => 'wraith'],
            (object)['name' => 'yamato'],
        ];

        return view('home', compact('heroes'));
    }
}
