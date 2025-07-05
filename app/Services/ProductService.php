<?php

namespace App\Services;

use App\Dtos\ListProductsFiltersDto;
use App\Repositories\ProductRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        private readonly ProductRepository $productRepository = new ProductRepository,
    ) {
    }

    public function listProducts(ListProductsFiltersDto $filtersDto): LengthAwarePaginator
    {
        
        return cache()->remember(sprintf('products_query%s', implode('_', [
            $filtersDto->minPrice,
            $filtersDto->maxPrice,
            $filtersDto->search,
        ])), 300, function () use ($filtersDto) {
            return $this->productRepository->productsQuery($filtersDto)->paginate();
        });
    }
}
