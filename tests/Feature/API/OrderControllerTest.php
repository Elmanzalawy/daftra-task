<?php

namespace Tests\Feature;

use App\Dtos\OrderDto;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;

    protected Order $order;

    protected OrderDto $orderDto;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs(User::factory()->create());
    }

    public function test_guest_cannot_place_order(): void
    {
        auth()->logout();

        $this->post(route('api.v1.orders.placeOrder'))
            ->assertStatus(401);
    }

    public function test_authenticated_user_can_place_order(): void
    {
        $initialOrderCount = Order::count();

        $products = Product::factory()->count(3)->create();
        $this->post(
            route('api.v1.orders.placeOrder'),
            [
                'products' => $products->map(function ($product) {
                    return [
                        'product_id' => $product->id,
                        'quantity' => 1,
                    ];
                })->toArray(),
            ]
        )
            ->assertStatus(201);

        $this->assertEquals($initialOrderCount + 1, Order::count());
    }

    public function test_guest_cannot_view_order(): void
    {
        Order::factory()->create();

        auth()->logout();

        $this->get(route('api.v1.orders.getById', ['orderId' => 1]))
            ->assertStatus(401);
    }

    public function test_authenticated_user_can_view_their_order(): void
    {

        $order = Order::factory()->create([
            'user_id' => auth()->id(),
        ]);

        $this->get(route('api.v1.orders.getById', ['orderId' => $order->id]))->assertStatus(200);
    }
}
