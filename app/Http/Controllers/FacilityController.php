<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = Facility::with('classrooms')->get();
        
        return view('facilities.index', [
            'facilities' => $facilities
        ]);
    }

    public function show(Facility $facility)
    {
        return view('facilities.show', [
            'facility' => $facility,
            'classrooms' => $facility->classrooms()->with('facilities')->get()
        ]);
    }
}