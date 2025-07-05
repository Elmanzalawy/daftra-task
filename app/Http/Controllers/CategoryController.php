<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService = new CategoryService,
    ) {}

    public function index(): JsonResponse
    {

        return response()->json(CategoryResource::collection($this->categoryService->getCategories()), 200);
    }
}
