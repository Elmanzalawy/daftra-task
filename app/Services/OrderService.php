<?php

namespace App\Services;

use App\Actions\Order\CalculateOrderTotals;
use App\Actions\Order\PlaceOrder;
use App\Actions\Order\ValidateOrder;
use App\Dtos\OrderDto;
use DB;
use Illuminate\Pipeline\Pipeline;

class OrderService
{
    /**
     * Place an order.
     *
     * @param OrderDto $orderDto
     * @return OrderDto
     */
    public function placeOrder(OrderDto $orderDto): OrderDto
    {
        DB::beginTransaction();

        /**
         * @var OrderDto $result
         */
        $result = app(abstract: Pipeline::class)
            ->send($orderDto)
            ->through([
                ValidateOrder::class,
                CalculateOrderTotals::class,
                PlaceOrder::class,
            ])
            ->thenReturn();

        DB::commit();

        return $result;
    }
}