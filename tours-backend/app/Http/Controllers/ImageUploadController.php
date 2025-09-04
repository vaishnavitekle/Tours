<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => [
                    'required',
                    'image',
                    'mimes:jpeg,png,jpg,gif',
                    'max:2*2048*2048' // 2MB Max
                ]
            ], [
                'image.required' => 'Please select an image to upload.',
                'image.image' => 'The file must be an image.',
                'image.mimes' => 'Only JPG, JPEG, PNG, and GIF images are allowed.',
                'image.max' => 'The image must not be larger than 2MB.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file was uploaded.'
                ], 400);
            }

            $image = $request->file('image');
            
            // Ensure the directory exists
            $path = 'public/images';
            if (!Storage::exists($path)) {
                Storage::makeDirectory($path, 0755, true);
            }
            
            $filename = time() . '_' . $image->getClientOriginalName();
            $storedPath = $image->storeAs($path, $filename);
            
            if (!$storedPath) {
                throw new \Exception('Failed to store the uploaded file.');
            }

            $url = Storage::url($storedPath);
            $fullUrl = asset($url);

            return response()->json([
                'success' => true,
                'url' => $fullUrl,
                'message' => 'Image uploaded successfully.'
            ]);

        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while uploading the image: ' . $e->getMessage()
            ], 500);
        }
    }
}