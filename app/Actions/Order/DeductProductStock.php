<?php

namespace App\Actions\Order;

use App\Dtos\OrderDto;
use App\Models\Order;
use Closure;

class DeductProductStock
{
    public function handle(OrderDto $orderDto, Closure $next): mixed
    {
        if ($orderDto->orderId) {
            $order = Order::find($orderDto->orderId);

            /**
             * @var \App\Models\Product $product
             */
            foreach ($order->products as $product) {
                $product->update([
                    'stock' => $product->stock - $product->pivot->quantity,
                ]);
            }
        }

        return $next($orderDto);
    }
}
