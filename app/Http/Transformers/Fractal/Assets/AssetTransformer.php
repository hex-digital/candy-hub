<?php

namespace GetCandy\Http\Transformers\Fractal\Assets;

use GetCandy\Api\Assets\Models\Asset;
use GetCandy\Http\Transformers\Fractal\BaseTransformer;
use Storage;


class AssetTransformer extends BaseTransformer
{
    protected $availableIncludes = [
        'transforms'
    ];

    /**
     * Decorates the attribute object for viewing
     * @param  Attribute $product
     * @return array
     */
    public function transform(Asset $asset)
    {
        $data = [
            'id' => $asset->encodedId(),
            'title' => $asset->title,
            'caption' => $asset->caption,
            'kind' => $asset->kind,
            'external' => (bool) $asset->external,
            'thumbnail' => $this->getThumbnail($asset),
            'position' => (int) $asset->position
        ];

        if (!$asset->external) {
            $data = array_merge($data, [
                'sub_kind' => $asset->sub_kind,
                'extension' => $asset->extension,
                'original_filename' => $asset->original_filename,
                'size' => $asset->size,
                'width' => $asset->width,
                'height' => $asset->height,
                'url' => $this->getUrl($asset)
            ]);
        } else {
            $data['url'] = $asset->location;
        }

        return $data;
    }

    protected function getThumbnail($asset)
    {
//        return $asset->transforms
        $transform = $asset->transforms->filter(function ($transform) {
            return $transform->transform->handle == 'thumbnail';
        })->first();

        if (!$transform) {
            return null;
        }

        $path = $transform->location . '/' . $transform->filename;
        return Storage::disk($asset->source->disk)->url($path);
    }
    protected function getUrl($asset)
    {
        $path = $asset->location . '/' . $asset->filename;
        return Storage::disk($asset->source->disk)->url($path);
    }

    public function includeTransforms($asset)
    {
        return $this->collection($asset->transforms, new AssetTransformTransformer);
    }
}
