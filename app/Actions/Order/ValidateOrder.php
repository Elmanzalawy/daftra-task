<?php

namespace App\Actions\Order;

use App\Dtos\OrderDto;
use App\Exceptions\EmptyCartException;
use App\Exceptions\ProductNotFoundException;
use App\Exceptions\ProductOutOfStockException;
use App\Exceptions\ProductUnavailableException;
use App\Models\Product;
use Closure;

class ValidateOrder
{
    public function handle(OrderDto $orderDto, Closure $next): mixed
    {
        $this->validateCart($orderDto);
        $this->validateProductsAvailability($orderDto);

        return $next($orderDto);
    }

    private function validateCart(OrderDto $orderDto): void
    {
        if (empty($orderDto->products)) {
            throw new EmptyCartException('The cart is empty.');
        }
    }

    private function validateProductsAvailability(OrderDto $orderDto): void
    {
        foreach ($orderDto->products as $orderProductDto) {
            $product = Product::find($orderProductDto->productId);

            if (! $product) {
                throw new ProductNotFoundException("Product with ID {$orderProductDto->productId} does not exist.");
            }

            if (! $product->active()) {
                throw new ProductUnavailableException("Product with ID {$orderProductDto->productId} is unavailable.");
            }

            if ($product->stock < $orderProductDto->quantity) {
                throw new ProductOutOfStockException("Product with ID {$orderProductDto->productId} is out of stock.");
            }
        }
    }
}
