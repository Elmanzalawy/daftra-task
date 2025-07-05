<?php

namespace App\Repositories;

use App\Dtos\ListProductsFiltersDto;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class ProductRepository
{
    /**
     * @return Builder<Builder<Product>>|Builder<Product>|Product
     */
    public function productsQuery(ListProductsFiltersDto $filtersDto): Builder
    {
        return Product::query()
            ->active()
            ->where(function (Builder $q) use ($filtersDto) {
                if (isset($filtersDto->categories) && count($filtersDto->categories) > 0) {
                    $q->whereIn('category_id', $filtersDto->categories);
                }
                if (isset($filtersDto->search)) {
                    $q->where('name', 'like', '%'.$filtersDto->search.'%');
                }

                if (isset($filtersDto->minPrice)) {
                    $q->where('price', '>=', $filtersDto->minPrice);
                }

                if (isset($filtersDto->maxPrice)) {
                    $q->where('price', '<=', $filtersDto->maxPrice);
                }
            });
    }
}
