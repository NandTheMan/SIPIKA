<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body class="font-sans antialiased">
    <h1>Create A Classroom</h1>
    <form method="post" action="{{route('classrooms.add')}}">
        @csrf
        @method('post')
        <div>
            <label>Classroom Name</label>
            <input type="text" name="classroom_name" placeholder="classroom_name"/>
        </div>
        <div>
            <label>Classroom Capacity</label>
            <input type="number" name="classroom_capacity" placeholder="classroom_capacity"/>
        </div>
        <div>
            <label>Classroom Floor</label>
            <input type="number" name="classroom_floor" placeholder="classroom_floor"/>
        </div>
        <div>
            <input type="submit" value="Save A New Classroom"/>
        </div>
    </form>
</body>
</html>
