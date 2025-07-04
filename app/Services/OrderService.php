<?php

namespace App\Services;

use App\Actions\Order\CalculateOrderTotals;
use App\Actions\Order\PlaceOrder;
use App\Actions\Order\ValidateOrder;
use App\Dtos\OrderDto;
use App\Repositories\OrderRepository;
use DB;
use Illuminate\Pipeline\Pipeline;

class OrderService
{
    public function __construct(
        private readonly OrderRepository $orderRepository = new OrderRepository,
    ) {}

    public function placeOrder(OrderDto $orderDtoDto): OrderDto
    {
        DB::beginTransaction();

        /**
         * @var OrderDto $result
         */
        $result = app(abstract: Pipeline::class)
            ->send($orderDtoDto)
            ->through([
                ValidateOrder::class,
                CalculateOrderTotals::class,
                PlaceOrder::class,
            ])
            ->thenReturn();

        DB::commit();

        return $result;
    }

    public function getOrderById(int $orderId): ?OrderDto
    {
        $order = $this->orderRepository->getOrderById($orderId);

        if (! $order) {
            return null;
        }

        return OrderDto::fromArray([
            ...$order->toArray(),
            'products' => $order->products,
        ]);
    }
}
