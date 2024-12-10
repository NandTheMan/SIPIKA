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
    <h1>Classroom</h1>
    <div>
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Ruang Kelas</th>
                <th>Ukuran Kelas</th>
                <th>Lantai</th>
                <th>Terbooking</th>
            </tr>
            @foreach($classrooms as $classroom)
                <tr>
                    <td>{{$classroom->classroom_id}}</td>
                    <td>{{$classroom->classroom_name}}</td>
                    <td>{{$classroom->classroom_capacity}}</td>
                    <td>{{$classroom->classroom_floor}}</td>
                    <td>{{ $classroom->classroom_is_booked ? 'Yes' : 'No' }}</td>
                </tr>
            @endforeach
        </table>
    </div>
    <div>
        <a href="{{ route('classrooms.create') }}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Create New Classroom</a>
    </div>
</body>
</html>
