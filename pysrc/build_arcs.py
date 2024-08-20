import json
import random

def main():

    NODES_FILE = "public/nodes.geojson"
    NETWORKS = ["AlphaNet", "BravoNet", "CharlieNet", "DeltaNet"]
    PATH_COLOR_STANDARD = [96, 108, 240, 255]
    PATH_COLOR_HARDENED = [89, 242, 78, 255]

    with open(NODES_FILE, 'r') as f:
        input_json = json.load(f)

    nodes = input_json['features']

    print(f"Found {len(nodes)} nodes.")

    # Create unique src-target pairs indices
    pair_names = []
    pair_indexes = []
    src_index = 0
    for src_node in nodes:
        for i in range(1, random.randint(1, 20)):
            dest_node_index = random.randint(0, len(nodes) - 1)
            if dest_node_index != src_index:       # dont link to self (some might be orphaned)
                dest_node = nodes[dest_node_index]
                this_pair = f"{src_node['properties']['name']} -> {dest_node['properties']['name']}" 
                if this_pair not in pair_names:
                    pair_names.append(this_pair)
                    pair_indexes.append({ "src_idx": src_index, "dest_idx": dest_node_index})

        src_index += 1

    arc_list = []
    for pair_index in pair_indexes:
        src_node = nodes[pair_index["src_idx"]]
        dest_node = nodes[pair_index["dest_idx"]]
    
        src_color = PATH_COLOR_STANDARD
        if random.random() > .85:
            src_color = PATH_COLOR_HARDENED

        rugged_path = 0
        src_color = PATH_COLOR_STANDARD
        if src_node["properties"]["ruggedized"] and dest_node["properties"]["ruggedized"]:
            rugged_path = 1
            src_color = PATH_COLOR_HARDENED

        dest_color = src_color
            
        arc = {
            "sourcePosition": src_node["geometry"]["coordinates"],
            "targetPosition": dest_node["geometry"]["coordinates"],
            "sourceColor": src_color,
            "targetColor": dest_color,
            "numPaths": random.randint(1, 29),
            "ruggedPath": rugged_path,
            "network": random.choice(NETWORKS),
        }
        arc_list.append(arc)

    num_arcs = len(arc_list)
    print(f"Created {num_arcs} arcs.")
    arcs_json = {"type": "FeatureCollection", "features": arc_list}
    arcs_json = json.dumps(arcs_json, indent=4)

    with open('public/arcs.geojson', 'w') as f:
        f.write(arcs_json)



if __name__ == '__main__':
    main()
    print("DONE\n")