import json
import random

def main():

    INPUT_FILE = "public/nodes_filtered.geojson"

    with open(INPUT_FILE, 'r') as f:
        input_json = json.load(f)

    print(f"Found {len(input_json['features'])} features.")

    nodelist = []
    for feature in input_json['features']:
        ruggedized = random.choice([0, 1])

        node = {
            "type": "Feature",
            "properties": {
                "name": feature["properties"]["name"],
                "url": feature["properties"]["wikipedia"],
                "score": feature["properties"]["scalerank"],
                "ruggedized": ruggedized
            },
            "geometry": feature["geometry"]
        }
        nodelist.append(node)

    nodes_json = {"type": "FeatureCollection", "features": nodelist}
    nodes_json = json.dumps(nodes_json, indent=4)

    with open('public/nodes.geojson', 'w') as f:
        f.write(nodes_json)


if __name__ == '__main__':
    main()
    print("DONE\n")