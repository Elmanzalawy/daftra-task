<?php

namespace App\Http\Controllers\API;

use App\Dtos\OrderDto;
use App\Http\Controllers\Controller;
use App\Http\Requests\PlaceOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService = new OrderService,
    ) {}

    public function placeOrder(PlaceOrderRequest $request): JsonResponse
    {
        $orderDto = OrderDto::fromArray($request->validated());

        $orderDto = $this->orderService->placeOrder($orderDto);

        return response()->json(OrderResource::make($orderDto), 201);
    }

    public function getOrderById(int $orderId): JsonResponse
    {
        $orderDto = $this->orderService->getOrderById($orderId);

        if (! $orderDto) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(OrderResource::make($orderDto), 200);
    }
}
