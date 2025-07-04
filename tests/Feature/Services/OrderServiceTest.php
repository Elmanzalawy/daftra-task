<?php

namespace Tests\Feature;

use App\Dtos\OrderDto;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;

    protected Order $order;

    protected OrderDto $orderDto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->orderService = new OrderService;

        $this->order = Order::factory()->create();

        $this->orderDto = OrderDto::fromArray([
            ...$this->order->toArray(),
            'products' => $this->order->products,
        ]);

        $this->actingAs(User::factory()->create());
    }

    public function test_that_an_order_can_be_placed(): void
    {
        $result = $this->orderService->placeOrder($this->orderDto);
        $order = Order::orderBy('id', 'desc')->first();

        $this->assertTrue($result instanceof OrderDto);
        $this->assertEquals($order->id, $result->orderId);
        $this->assertEquals($order->user_id, $result->customerId);
        $this->assertEquals($order->status, $result->status);
        $this->assertEquals(number_format($order->subtotal, 2), number_format(array_reduce($result->products, function ($carry, $product) {
            return $carry + $product->totalPrice;
        }, 0.0), 2));
        $this->assertEquals(number_format($order->shipping_total, 2), number_format($result->shipping_total, 2));
        $this->assertEquals(number_format($order->discount_total, 2), number_format($result->discount_total, 2));
        $this->assertEquals(number_format($order->tax_total, 2), number_format($result->tax_total, 2));
        $this->assertEquals(number_format($order->total_amount, 2), number_format($result->totalAmount, 2));
        $this->assertNotNull($order->created_at);
        $this->assertNotNull($order->updated_at);
    }
}
