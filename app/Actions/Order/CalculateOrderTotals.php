<?php

namespace App\Actions\Order;

use App\Dtos\OrderDto;
use Closure;

class CalculateOrderTotals
{
    public function handle(OrderDto $orderDto, Closure $next): mixed
    {
        $subtotal = $this->calculateSubtotal($orderDto);
        $shipping = $this->calculateShipping($orderDto);
        $taxes = $this->calculateTaxes($orderDto);
        $discount = config('sales-channels.discount_rate') * $subtotal;
        $total = $subtotal + $shipping + $taxes - $discount;

        return $next($orderDto->with([
            'subtotal' => $subtotal,
            'shipping_total' => $shipping,
            'tax_total' => $taxes,
            'discount_total' => $discount,
            'total_amount' => $total,
        ]));
    }

    private function calculateSubtotal(OrderDto $orderDto): float
    {
        return array_reduce($orderDto->products, function ($carry, $product) {
            return $carry + $product->totalPrice;
        }, 0.0);
    }

    private function calculateShipping(OrderDto $orderDto): float
    {
        return config('sales-channels.shipping_cost');
    }

    private function calculateTaxes(OrderDto $orderDto): float
    {
        return config('sales-channels.tax_rate') * $this->calculateSubtotal($orderDto);
    }

    private function calculateDiscount(OrderDto $orderDto): float
    {
        return config('sales-channels.discount_rate') * $this->calculateSubtotal($orderDto);
    }
}
