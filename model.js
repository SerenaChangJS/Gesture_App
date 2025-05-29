function extractFeatures (coords){
    let path_len = 0;
    let angles = [];
    let velocities = [];
    let accelerations = [];
    let x_coords = [coords[0][0]];
    let y_coords = [coords[0][1]];

    // prep for extracting features
    for (let i = 1; i<coords.length; i++) {

        if (coords.length <2){
            console.error("Error : extractFeatures (Invalid or too few coords)");
            return new Array(8).fill(0);
        }

        const prev = coords[i-1];
        const curr = coords[i];

        // calculate dist between points (consecutive)
        const dist = Math.sqrt((prev[0] - curr[0]) ** 2 + (prev[1] - curr[1])**2);
        
        // path length
        path_len += dist;

        // velocity 
        velocities.push(dist);
        
        // acceleration
        if (i>2) accelerations.push(velocities[i-1] - velocities[i-2]);

        // angle
        if (i>1) { 
            dx_1 = prev[0] - coords[i-2][0];
            dy_1 = prev[1] - coords[i-2][1];
            dx_2 = curr[0] - prev[0];
            dy_2 = curr[1] - prev[1];
            angles.push(Math.atan2(dy_2, dx_2) - Math.atan2(dy_1, dx_1));
        }

        // x and y coordinates
        x_coords.push(curr[0]);
        y_coords.push(curr[1]);
    }

    // extracting imp features
    const find_mean = arr => arr.reduce((a,b) => a+b) / arr.length;
    mean_v = velocities.length ? find_mean(velocities) : 0;
    mean_a = accelerations.length ? find_mean(accelerations) : 0;
    mean_angle = angles.length ? find_mean(angles) : 0;


    // displacement
    displacement = Math.sqrt((coords[0][0] - coords[coords.length-1][0]) ** 2 + (coords[0][1] - coords[coords.length-1][1])**2);

    // bounds
    bbox_w = Math.max(...x_coords) - Math.min(...x_coords);
    bbox_h = Math.max(...y_coords) - Math.min(...y_coords);

    bbox_ratio = bbox_h != 0 ? bbox_w / bbox_h : 1;

    // add all imp info to X
    return [
        path_len, 
        displacement, 
        mean_v, 
        mean_a, 
        mean_angle, 
        bbox_w, 
        bbox_h, 
        bbox_ratio
    ];
}

function model_classify(input, k=3){
    selected_feature = [1, 3, 4, 5, 7] // got from DecisionTree.py's output
    selected_extracted_feature = []
    selected_feature.forEach((i) =>{
        selected_extracted_feature.push(input[i]);
    });
    return classification(selected_extracted_feature);
}