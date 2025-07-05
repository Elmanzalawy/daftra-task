<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected ProductService $productService;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_guests_can_list_products(): void
    {
        auth()->logout();
        Product::factory()->count(5)->create(['is_active' => true]);

        $response = $this->get(route('api.v1.products.list'));

        $response->assertStatus(200);
    }

    public function test_it_lists_active_products_only(): void
    {
        Product::factory()->count(5)->create(['is_active' => true]);
        Product::factory()->count(3)->create(['is_active' => false]);

        $this->get(route('api.v1.products.list'))
            ->assertJsonCount(5, 'data');
    }

    public function test_it_can_search_products_by_name(): void
    {
        Product::factory()->count(5)->create(['is_active' => true]);
        $searchTerm = 'oddly specific product name';
        Product::factory()->create(['name' => $searchTerm, 'is_active' => true]);

        $this->get(route('api.v1.products.list', [
            'search' => $searchTerm,
        ]))
            ->assertJsonCount(1, 'data');
    }

    public function test_it_can_filter_products_by_category_ids(): void
    {
        Category::factory()->count(3)->create();
        Product::factory()->count(10)->create(['is_active' => true]);

        $categoryIds = $this->faker()->randomElements(Category::pluck('id')->toArray(), 2);

        $response = $this->get(route('api.v1.products.list', [
            'categories' => $categoryIds,
        ]));

        foreach ($response->json('data') as $product) {
            $this->assertContains($product['category_id'], $categoryIds);
        }
    }

    public function test_it_can_filter_products_by_price_range(): void
    {
        $minPrice = 10;
        $maxPrice = 100;

        Product::factory()->count(5)->create(['is_active' => true]);

        $response = $this->get(route('api.v1.products.list', [
            'minPrice' => $minPrice,
            'maxPrice' => $maxPrice,
        ]));

        foreach ($response->json('data') as $product) {
            $this->assertTrue(
                $product['price'] >= $minPrice && $product['price'] <= $maxPrice,
                "Product price {$product['price']} is not within the range {$minPrice} - {$maxPrice}"
            );
        }
    }
}
