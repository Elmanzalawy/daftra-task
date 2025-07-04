<?php

use App\Http\Controllers\API\OrderController;
use App\Http\Middleware\EnforceJson;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1', 'as' => 'api.v1.', 'middleware'], function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders', [OrderController::class, 'placeOrder'])->name('orders.placeOrder');
        Route::get('/orders/{orderId}', [OrderController::class, 'getOrderById'])->name('orders.getById');
    });
})->middleware([EnforceJson::class]);
