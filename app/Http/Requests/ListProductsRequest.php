<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListProductsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'minPrice' => 'nullable|numeric|min:0|lt:maxPrice',
            'maxPrice' => 'nullable|numeric|min:0|gt:minPrice',
            'categories' => 'nullable|array',
            'categories.*' => 'string|max:255',
        ];
    }
}
