<?php

namespace Tests\Feature;

use App\Dtos\OrderDto;
use App\Events\OrderCreated;
use App\Listeners\SendConfirmationEmail;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
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
        $this->assertEquals($order->user_id, $result->userId);
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

    public function test_that_an_event_is_dispatched_when_order_is_placed(): void
    {
        Event::fake();

        $result = $this->orderService->placeOrder($this->orderDto);
        $order = Order::orderBy('id', 'desc')->first();

        Event::assertDispatched(OrderCreated::class);

        Event::assertListening(
            OrderCreated::class,
            SendConfirmationEmail::class
        );
    }

    public function test_get_order_by_id(): void
    {
        $result = $this->orderService->getOrderById(Order::first()->id);

        $this->assertTrue($result instanceof OrderDto);
    }

    public function test_get_order_by_id_returns_null_if_order_is_not_found(): void
    {
        $result = $this->orderService->getOrderById(-1);

        $this->assertNull($result);
    }
}
