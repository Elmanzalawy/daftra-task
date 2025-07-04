<?php

namespace App\Dtos;

readonly class OrderDto extends Dto
{
    public function __construct(
        public ?int $orderId = null,
        public ?int $userId = null,
        /**
         * @var OrderProductDto[]
         */
        public array $products = [],
        public ?float $subtotal = null,
        public ?float $shipping_total = null,
        public ?float $discount_total = null,
        public ?float $tax_total = null,
        public ?float $totalAmount = null,
        public ?string $status = null,
        public ?string $paidAt = null,
        public ?string $shippedAt = null,
        public ?string $deliveredAt = null,
        public ?string $cancelledAt = null,
        public ?string $createdAt = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            orderId: $data['order_id'] ?? null,
            userId: $data['user_id'] ?? null,
            products: ! empty($data['products']) ? OrderProductDto::parseProduct($data['products']) : [],
            subtotal: $data['subtotal'] ?? null,
            shipping_total: $data['shipping_total'] ?? null,
            discount_total: $data['discount_total'] ?? null,
            tax_total: $data['tax_total'] ?? null,
            totalAmount: $data['total_amount'] ?? null,
            status: $data['status'] ?? null,
            paidAt: $data['paid_at'] ?? null,
            shippedAt: $data['shipped_at'] ?? null,
            deliveredAt: $data['delivered_at'] ?? null,
            cancelledAt: $data['cancelled_at'] ?? null,
            createdAt: $data['created_at'] ?? null
        );
    }

    public function with(array $params): self
    {
        return new self(
            orderId: $params['order_id'] ?? $this->orderId,
            userId: $params['user_id'] ?? $this->userId,
            products: $params['products'] ?? $this->products,
            subtotal: $params['subtotal'] ?? $this->subtotal,
            shipping_total: $params['shipping_total'] ?? $this->shipping_total,
            discount_total: $params['discount_total'] ?? $this->discount_total,
            tax_total: $params['tax_total'] ?? $this->tax_total,
            totalAmount: $params['total_amount'] ?? $this->totalAmount,
            status: $params['status'] ?? $this->status,
            paidAt: $params['paid_at'] ?? $this->paidAt,
            shippedAt: $params['shipped_at'] ?? $this->shippedAt,
            deliveredAt: $params['delivered_at'] ?? $this->deliveredAt,
            cancelledAt: $params['cancelled_at'] ?? $this->cancelledAt,
            createdAt: $params['created_at'] ?? $this->createdAt,
        );
    }

    public function toArray(): array
    {
        return [
            'order_id' => $this->orderId,
            'user_id' => $this->userId,
            'products' => $this->products,
            'subtotal' => $this->subtotal,
            'shipping_total' => $this->shipping_total,
            'discount_total' => $this->discount_total,
            'tax_total' => $this->tax_total,
            'total_amount' => $this->totalAmount,
            'status' => $this->status,
            'paid_at' => $this->paidAt,
            'shipped_at' => $this->shippedAt,
            'delivered_at' => $this->deliveredAt,
            'cancelled_at' => $this->cancelledAt,
            'created_at' => $this->createdAt,
        ];
    }
}
