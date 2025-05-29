function classification(input) {
    /*
    input[0] = displacement
    input[1] = mean accleration
    input[2] = mean angle
    input[3] = bbox width
    input[4] = bbox ratio
    */

    let gesture = '';
    if (input[0] <= 94.9386215209961) {
        if (input[3] <= 33.0) {
            if (input[4] <= 0.22995392233133316) {
                gesture = ']';
            } else {
                if (input[2] <= -0.030799927189946175) {
                    gesture = 'o';
                } else {
                    gesture = '[';
                }
            }
        } else {
            gesture = 'o';
        }
    } else {
        if (input[2] <= -0.02636880613863468) {
            if (input[4] <= 0.2102958932518959) {
                gesture = ']';
            } else {
                if (input[2] <= -0.1061941459774971) {
                    gesture = 'o';
                } else {
                    gesture = '[';
                }
            }
        } else {
            if (input[2] <= 0.008870626334100962) {
                if (input[1] <= -0.06336880847811699) {
                    gesture = ']';
                } else {
                    if (input[4] <= 0.606910228729248) {
                        gesture = ']';
                    } else {
                        gesture = '[';
                    }
                }
            } else {
                if (input[1] <= -0.07799001038074493) {
                    gesture = '[';
                } else {
                    if (input[0] <= 243.41869354248047) {
                        gesture = '[';
                    } else {
                        gesture = ']';
                    }
                }
            }
        }
    }
    return gesture;
}