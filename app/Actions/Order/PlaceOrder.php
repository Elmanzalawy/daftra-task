<?php

namespace App\Actions\Order;

use App\Dtos\OrderDto;
use App\Enums\OrderStatus;
use App\Models\Order;
use Closure;

class PlaceOrder
{
    public function handle(OrderDto $orderDto, Closure $next): mixed
    {
        $order = Order::create([
            ...$orderDto->toArray(),
            'user_id' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
            'status' => OrderStatus::Pending->value,
        ]);

        $this->attachProductsToOrder($order, $orderDto->products);

        return $next($orderDto->with([
            'order_id' => $order->id,
            'customer_id' => $order->user_id,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'status' => $order->status,            
        ]));
    }

    private function attachProductsToOrder(Order $order, array $products): void
    {
        foreach ($products as $product) {
            $order->products()->attach($product->productId, [
                'product_id' => $product->productId,
                'quantity' => $product->quantity,
                'unit_price' => $product->unitPrice,
            ]);
        }
    }
}