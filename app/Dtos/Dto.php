<?php

namespace App\Dtos;

abstract readonly class Dto
{
    /**
     * Convert the DTO to an array.
     *
     * @return array<string, mixed>
     */
    abstract public function toArray(): array;

    /**
     * Create a DTO instance from an array.
     *
     * @param  array<string, mixed>  $data
     */
    abstract public static function fromArray(array $data): self;
}
