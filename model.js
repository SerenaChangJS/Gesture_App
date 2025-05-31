function extractFeatures (coords){
    let path_len = 0;
    let angles = [];
    let half_angles = [];
    let velocities = [];
    let accelerations = [];
    let x_coords = [coords[0][0]];
    let y_coords = [coords[0][1]];

    // prep for extracting features
    for (let i = 1; i<coords.length; i++) {

        if (coords.length <2){
            console.error("Error : extractFeatures (Invalid or too few coords)");
            return new Array(10).fill(0);
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
        if (i>=2) accelerations.push(velocities[i-1] - velocities[i-2]);

        // angle
        if (i>1) { 
            let prev_2 = coords[i-2];
            let dx_1 = prev[0] - prev_2[0];
            let dy_1 = prev[1] - prev_2[1];
            let dx_2 = curr[0] - prev[0];
            let dy_2 = curr[1] - prev[1];
            let delta_theta = Math.atan2(dy_1, dx_1) - Math.atan2(dy_2, dx_2);
            if (delta_theta > Math.PI) delta_theta -= 2 * Math.PI;
            else if (delta_theta < -Math.PI) delta_theta += 2 * Math.PI;
            angles.push(delta_theta);
            if (i < Math.floor(coords.length / 2)) {
                half_angles.push(delta_theta);
            }
        }

        // x and y coordinates
        x_coords.push(curr[0]);
        y_coords.push(curr[1]);
    }

    // extracting imp features
    const find_mean = arr => arr.reduce((a,b) => a+b) / arr.length;
    let mean_v = velocities.length ? find_mean(velocities) : 0;
    let mean_a = accelerations.length ? find_mean(accelerations) : 0;
    let mean_angle = angles.length ? find_mean(angles) : 0;
    let curvature = angles.reduce((a,b) => a+b, 0);
    let half_curvature = half_angles.reduce((a, b) => a + b, 0);

    // displacement
    let displacement = Math.sqrt((coords[0][0] - coords[coords.length-1][0]) ** 2 + (coords[0][1] - coords[coords.length-1][1])**2);

    // bounds
    let bbox_w = Math.max(...x_coords) - Math.min(...x_coords);
    let bbox_h = Math.max(...y_coords) - Math.min(...y_coords);

    let bbox_ratio = bbox_h != 0 ? bbox_w / bbox_h : 1;

    // starting and ending angle
    let start_dx = coords[1][0] - coords[0][0]
    let start_dy = coords[1][1] - coords[0][1]
    let end_dx = coords[coords.length-1][0] - coords[coords.length-2][0]
    let end_dy = coords[coords.length-1][1] - coords[coords.length-2][1]
    start_angle = Math.atan2(start_dy, start_dx)
    end_angle = Math.atan2(end_dy, end_dx)

    // add all imp info to X
    return [
        path_len, 
        displacement, 
        mean_v, 
        mean_a, 
        mean_angle, 
        curvature, 
        half_curvature,
        bbox_w, 
        bbox_h, 
        bbox_ratio, 
        start_angle, 
        end_angle
    ];
}

function model_classify(input, k=3){
    selected_feature = [0, 1, 3, 4, 6, 11] // got from DecisionTree.py's output
    selected_extracted_feature = []
    selected_feature.forEach((i) =>{
        selected_extracted_feature.push(input[i]);
    });
    return classification(selected_extracted_feature);
}