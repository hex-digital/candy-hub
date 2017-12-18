<?php
namespace GetCandy\Http\Transformers\Fractal\Shipping;

use Illuminate\Database\Eloquent\Model;
use GetCandy\Api\Traits\IncludesAttributes;
use GetCandy\Api\Shipping\Models\ShippingMethod;
use GetCandy\Http\Transformers\Fractal\BaseTransformer;
use GetCandy\Http\Transformers\Fractal\Channels\ChannelTransformer;

class ShippingMethodTransformer extends BaseTransformer
{
    use IncludesAttributes;
    
    protected $availableIncludes = [
        'zones', 'prices', 'attribute_groups', 'channels', 'customer_groups'
    ];

    public function transform(ShippingMethod $method)
    {
        return [
            'id' => $method->encodedId(),
            'type' => $method->type,
            'attribute_data' => $method->attribute_data
        ];
    }

    protected function includePrices($method)
    {
        return $this->collection($method->prices, new ShippingPriceTransformer);
    }

    protected function includeZones(ShippingMethod $method)
    {
        return $this->collection($method->zones, new ShippingZoneTransformer);
    }

    /**
     * @param ShippingMethod $method
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeChannels(ShippingMethod $method)
    {
        $channels = app('api')->channels()->getChannelsWithAvailability($method, 'shipping_methods');
        return $this->collection($channels, new ChannelTransformer);
    }
}
