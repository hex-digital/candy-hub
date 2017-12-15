<?php
namespace GetCandy\Http\Transformers\Fractal\Shipping;

use Illuminate\Database\Eloquent\Model;
use GetCandy\Api\Shipping\Models\ShippingPrice;
use GetCandy\Http\Transformers\Fractal\BaseTransformer;
use GetCandy\Http\Transformers\Fractal\Currencies\CurrencyTransformer;

class ShippingPriceTransformer extends BaseTransformer
{
    protected $availableIncludes = [
        'method'
    ];

    protected $defaultIncludes = [
        'currency'
    ];

    public function transform(ShippingPrice $price)
    {
        return [
            'id' => $price->encodedId(),
            'rate' => $price->rate,
            'fixed' => (bool) $price->fixed,
            'min_weight' => $price->min_weight,
            'weight_unit' => $price->weight_unit,
            'min_height' => $price->min_height,
            'height_unit' => $price->height_unit,
            'min_width' => $price->min_width,
            'width_unit' => $price->width_unit,
            'min_depth' => $price->min_depth,
            'depth_unit' => $price->depth_unit,
            'min_volume' => $price->min_volume,
            'volume_unit' => $price->volume_unit,
        ];
    }

    protected function includeMethod($price)
    {
        return $this->item($price->method, new ShippingMethodTransformer);
    }

    protected function includeCurrency($price)
    {
        return $this->item($price->currency, new CurrencyTransformer);
    }
}