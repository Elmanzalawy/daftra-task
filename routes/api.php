<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Middleware\EnforceJson;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1', 'as' => 'api.v1.', 'middleware'], function () {
    /**
     * UNAUTHENTICATED ROUTES
     */
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::get('/products', [ProductController::class, 'listProducts'])->name('products.list');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

    /**
     * AUTHENTICATED ROUTES
     */
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders', [OrderController::class, 'placeOrder'])->name('orders.placeOrder');
        Route::get('/orders/{orderId}', [OrderController::class, 'getOrderById'])->name('orders.getById');
    });
})->middleware([EnforceJson::class]);
