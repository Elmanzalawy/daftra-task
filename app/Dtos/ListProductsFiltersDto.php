<?php

namespace App\Dtos;

use Illuminate\Database\Eloquent\Builder;

readonly class ListProductsFiltersDto extends Dto
{
    public function __construct(
        public ?Builder $qb = null,
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
            qb: $data['qb'] ?? null,
            search: $data['search'] ?? null,
            minPrice: $data['minPrice'] ?? null,
            maxPrice: $data['maxPrice'] ?? null,
            categories: $data['categories'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'qb' => $this->qb,
            'search' => $this->search,
            'minPrice' => $this->minPrice,
            'maxPrice' => $this->maxPrice,
            'categories' => $this->categories,
        ];
    }
}
