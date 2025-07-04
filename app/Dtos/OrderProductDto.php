<?php

namespace App\Dtos;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

readonly class OrderProductDto extends Dto
{
    public function __construct(
        public int $productId,
        public int $quantity,
        public ?float $unitPrice = null,
        public ?float $totalPrice = null,
        public ?int $orderId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: $data['product_id'],
            quantity: $data['quantity'],
            unitPrice: $data['unitPrice'] ?? null,
            totalPrice: $data['totalPrice'] ?? null,
            orderId: $data['order_id'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'order_id' => $this->orderId,
            'productId' => $this->productId,
            'quantity' => $this->quantity,
            'unitPrice' => $this->unitPrice,
            'totalPrice' => $this->totalPrice,
        ];
    }

    /**
     * @param  \Traversable<int, array|Product>  $products
     * @return OrderProductDto[]
     */
    public static function parseProduct(array|Collection $products): array
    {
        $productsBuffer = [];

        foreach ($products as $product) {
            if ($product instanceof Product) {
                $productsBuffer[] = OrderProductDto::fromArray([
                    'order_id' => $product->pivot->order_id,
                    'product_id' => $product->id,
                    'quantity' => $product->pivot->quantity,
                    'unitPrice' => $product->pivot->unit_price,
                    'totalPrice' => $product->pivot->total_price,
                ]);
            } else {
                $productsBuffer[] = OrderProductDto::fromArray($product);
            }
        }

        return $productsBuffer;
    }
}
