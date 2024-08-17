import json

def main():

    INPUT_FILE = "public/ne_10m_airports.geojson"

    with open(INPUT_FILE, 'r') as f:
        input_json = json.load(f)

    print(f"Found {len(input_json['features'])} features.")

    nodelist = []
    for feature in input_json['features']:
        if feature["properties"]["type"] == 'major':
            print(f"Keep {feature['properties']['name']} ?")
            k = input()
            if k == 'y':
                nodelist.append(feature)

    nodes_json = {"type": "FeatureCollection", "features": nodelist}
    nodes_json = json.dumps(nodes_json, indent=4)

    with open('nodes.geojson', 'w') as f:
        f.write(nodes_json)


if __name__ == '__main__':
    main()
    print("DONE\n")