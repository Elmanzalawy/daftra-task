<?php

namespace App\Services;

use App\Dtos\ListProductsFiltersDto;
use App\Repositories\ProductRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        private readonly ProductRepository $productRepository = new ProductRepository,
    ) {}

    public function listProducts(ListProductsFiltersDto $filtersDto): LengthAwarePaginator
    {
        return $this->productRepository->productsQuery($filtersDto)->paginate();
    }
}
