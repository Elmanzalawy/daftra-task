<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository
{
    public function getOrderById(int $orderId): ?Order
    {
        return Order::with('products')->find($orderId);
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrdersByUserId(int $userId): Collection
    {
        return Order::where('user_id', $userId)->get();
    }
}
