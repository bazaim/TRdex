<?php

$input_path = "./src/ressources/csv/spans.csv";
$output_path = "./src/app/core/span.data.ts";
$image_path = "./src/assets/imgs/maps/";
$spans = [];

echo "define csv index\r\n";
define('_COUNTRY', 0);
define('_INSEE', 1);
define('_CITY', 2);
define('_POSTAL', 3);
define('_SPAN', 4);
define('_GPS', 5);

echo "get & format input datas\r\n";
$input_content = file_get_contents($input_path);
$input_datas = array_map(function($a) {
    $a = explode(";", $a);
    if (isset($a[_INSEE]) && !empty($a[_INSEE]) && strlen($a[_INSEE]) == 4) {
        $a[_INSEE] = '0' . $a[_INSEE];
    }
    if (isset($a[_POSTAL]) && !empty($a[_POSTAL]) && strlen($a[_POSTAL]) == 4) {
        $a[_POSTAL] = '0' . $a[_POSTAL];
    }
    return $a;
}, explode("\r\n", $input_content));

echo "get coordinates :\r\n";
$input_datas = array_map(function($a) {
    echo $a[_CITY] . "\r\n";
    if (isset($a[_GPS])) {
        $a[_GPS] = explode(',', $a[_GPS]);
        if (count($a[_GPS]) !== 2) {
            unset($a[_GPS]);
        }
    }
    if (!isset($a[_GPS])) {
        if (strtoupper($a[_COUNTRY]) === "FR") {
            $url = "https://api-adresse.data.gouv.fr/search/?type=municipality&limit=1&q=" . urlencode($a[_CITY]);
            if (isset($a[_INSEE]) && !empty($a[_INSEE])) {
                $url .= "&citycode=" . $a[_INSEE];
            }
            $geo_json = json_decode(file_get_contents($url));
            if (property_exists($geo_json, "features") && count($geo_json->features)) {
                $a[_GPS] = $geo_json->features[0]->geometry->coordinates;
            } else {
                $url = "https://api-adresse.data.gouv.fr/search/?limit=1&q=" . urlencode($a[_CITY]);
                $geo_json = json_decode(file_get_contents($url));
                if (property_exists($geo_json, "features") && count($geo_json->features)) {
                    $a[_GPS] = $geo_json->features[0]->geometry->coordinates;
                }
            }
        }
    }
    return $a;
}, $input_datas);

echo "save input file after getting all GPS\r\n";
file_put_contents($input_path, implode("\r\n", array_map(function($a) {
    return implode(';', array_map(function($b) {
        if (is_string($b))
            return $b;
        return implode(',', $b);
    }, $a));
}, $input_datas)));

echo "group & order spans & cities\r\n";
foreach ($input_datas as $input_row) {
    if (!isset($spans[$input_row[_SPAN]])) {
        $spans[$input_row[_SPAN]] = [];
    }
    $spans[$input_row[_SPAN]][] = $input_row;
}
foreach ($spans as $i_span => $span) {
    usort($spans[$i_span], function($a, $b) {
        return strcmp($a[_CITY], $b[_CITY]);
    });
}
ksort($spans);

// echo "generate gMap images :\r\n";
// if(!is_dir($image_path)) {
//     mkdir($image_path);
// }
// foreach ($spans as $i_span => $span) {
//     echo $i_span . "\r\n";
//     $image = file_get_contents(generateGMapUrl($span));
//     if ($image) {
//         file_put_contents($image_path . $i_span . ".png", $image);
//     } else {
//         echo "\r\n" . generateGMapUrl($span) . "\r\n";
//         die();
//     }
// }


echo "set & write output string\r\n";
$output_content = "export const Spans = [
    ";

$index = 0;
foreach ($spans as $i_span => $span) {
    $index++;
    $output_content .= "{
        \"id\": ".$index.",
        \"label\": \"" . $i_span . "\",
        \"cities\": [";
    
    foreach ($span as $city) {
        $output_content .= "
            {
                \"label\": \"" . $city[_CITY] . "\",
                \"gps\": {
                    \"lat\": " . $city[_GPS][1] . ",
                    \"lng\": " . $city[_GPS][0] . "
                }
            },";
    }

    $output_content .= "
        ]
    },";
}
$output_content .= "
];";
file_put_contents($output_path, $output_content);



function generateGMapUrl($span) {
    $geojson = [
        (object) [
            "type" => "FeatureCollection",
            "features" => array_map(function($a) {
                return (object) [
                    "type" => "Feature",
                    "geometry" => (object) [
                        "type" => "Point",
                        "coordinates" => [
                            $a[_GPS][0],
                            $a[_GPS][1]
                        ]
                    ]
                ];
            }, $span)
        ]
    ];
    
    return "http://osm-static-maps.herokuapp.com/?height=400&width=700&maxZoom=13&tileserverUrl=https%3A%2F%2F%7Bs%7D.tile.thunderforest.com%2Ftransport%2F%7Bz%7D%2F%7Bx%7D%2F%7By%7D.png%3Fapikey%3D0641388541ea4213970158b52f4aaedd&geojson=" . urlencode(json_encode($geojson));
}
