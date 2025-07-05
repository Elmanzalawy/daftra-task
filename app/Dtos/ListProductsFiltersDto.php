<?php

namespace App\Dtos;

readonly class ListProductsFiltersDto extends Dto
{
    public function __construct(
        public ?string $search = null,
        public ?int $minPrice = null,
        public ?int $maxPrice = null,
        /**
         * @var array<int, string>|null
         */
        public ?array $categories = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            search: $data['search'] ?? null,
            minPrice: $data['minPrice'] ?? null,
            maxPrice: $data['maxPrice'] ?? null,
            categories: $data['categories'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'minPrice' => $this->minPrice,
            'maxPrice' => $this->maxPrice,
            'categories' => $this->categories,
        ];
    }
}
