<?php

namespace App\Actions\Order;

use App\Dtos\OrderDto;
use App\Enums\OrderStatus;
use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\Product;
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

        $orderDto = $orderDto->with([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'status' => $order->status,
        ]);

        OrderCreated::dispatch($orderDto);

        return $next($orderDto);
    }

    /**
     * @param  array<int, \App\Dtos\OrderProductDto>  $products
     */
    private function attachProductsToOrder(Order $order, array $productDtos): void
    {
        foreach ($productDtos as $productDto) {
            $product = Product::find($productDto->productId);

            $order->products()->attach($product->id, [
                'product_id' => $product->id,
                'quantity' => $productDto->quantity,
                'unit_price' => $product->price,
            ]);
        }
    }
}
