<?php

use App\Http\Controllers\SelectController;
use Illuminate\Support\Facades\Route;

Route::get('/',[SelectController::class, 'index'])->name('select.index');
