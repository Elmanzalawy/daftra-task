<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'status' => $this->faker->randomElement(OrderStatus::toArray()),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($order) {
            if (Product::count() === 0) {
                Product::factory()->count(5)->create();
            }

            $products = Product::inRandomOrder()->take($this->faker->numberBetween(1, 5))->get();

            foreach ($products as $product) {
                $order->products()->attach($product->id, [
                    'quantity' => $this->faker->numberBetween(1, $product->stock),
                    'unit_price' => $product->price,
                ]);
            }

            $order->update([
                'subtotal' => $subtotal = $order->getSubtotal(),
                'shipping_total' => $shippingTotal = $this->faker->randomFloat(2, 5, 50),
                'discount_total' => $discountTotal = $this->faker->randomFloat(2, 0, 50),
                'tax_total' => $taxTotal = floor($subtotal * config('sales-channels.tax_rate')),
                'total_amount' => $subtotal + $shippingTotal - $discountTotal + $taxTotal,
            ]);
        });
    }
}
