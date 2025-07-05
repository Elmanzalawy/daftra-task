<?php

namespace App\Http\Controllers\API;

use App\Dtos\ListProductsFiltersDto;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListProductsRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService = new ProductService,
    ) {}

    /**
     * @return JsonResponse|mixed
     */
    public function listProducts(ListProductsRequest $request): JsonResponse
    {
        return response()->json($this->productService->listProducts(
            ListProductsFiltersDto::fromArray($request->validated()),
        ));
    }
}
