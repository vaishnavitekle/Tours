<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TourController extends Controller
{
    // GET all tours
    public function index() {
        return Tour::all();
    }

    // GET single tour
    public function show($id) {
        return Tour::findOrFail($id);
    }

    // POST create tour
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            // Store the uploaded file
            $path = $request->file('image')->store('public/images');
            $imageUrl = Storage::url($path);

            // Create the tour
            $tour = Tour::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'price' => $validatedData['price'],
                'image' => $imageUrl,
            ]);

            return response()->json([
                'success' => true,
                'data' => $tour,
                'message' => 'Tour created successfully!'
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Tour creation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create tour. ' . $e->getMessage()
            ], 500);
        }
    }

    // PUT update tour
    public function update(Request $request, $id) {
        $tour = Tour::findOrFail($id);
        $tour->update($request->all());
        return $tour;
    }

    // DELETE tour
    public function destroy($id) {
        Tour::destroy($id);
        return response()->json(['message' => 'Tour deleted']);
    }
}
