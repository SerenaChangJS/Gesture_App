function classification(input) {

    var var0;

    // find highest probability
    
    if (input[1] <= 94.9386215209961) {
        if (input[4] <= -2.35619455575943) {
            var0 = [1.0, 0.0, 0.0];
        } else {
            if (input[0] <= 112.14189529418945) {
                if (input[1] <= 65.12322235107422) {
                    if (input[3] <= 0.15399964153766632) {
                        var0 = [1.0, 0.0, 0.0];
                    } else {
                        var0 = [0.0, 0.0, 1.0];
                    }
                } else {
                    var0 = [0.0, 1.0, 0.0];
                }
            } else {
                var0 = [0.0, 0.0, 1.0];
            }
        }
    } else {
        if (input[4] <= 0.05532861128449451) {
            if (input[2] <= -0.010318458080291748) {
                if (input[4] <= -4.05689799785614) {
                    var0 = [1.0, 0.0, 0.0];
                } else {
                    if (input[4] <= -0.48425450176000595) {
                        var0 = [0.058823529411764705, 0.9411764705882353, 0.0];
                    } else {
                        var0 = [1.0, 0.0, 0.0];
                    }
                }
            } else {
                if (input[3] <= -0.06521010398864746) {
                    var0 = [0.0, 1.0, 0.0];
                } else {
                    if (input[3] <= 0.02554140426218511) {
                        var0 = [0.5338983050847458, 0.4661016949152542, 0.0];
                    } else {
                        var0 = [0.0, 1.0, 0.0];
                    }
                }
            }
        } else {
            if (input[3] <= 0.024396860040724277) {
                var0 = [0.0, 1.0, 0.0];
            } else {
                if (input[0] <= 666.4439697265625) {
                    var0 = [0.9723502304147466, 0.027649769585253458, 0.0];
                } else {
                    var0 = [0.0, 0.0, 1.0];
                }
            }
        }
    }

    const classes = ['[', ']', 'o'];
    let maxIndex = 0;
    for (let i=1; i<var0.length; i++){
        if (var0[i] > var0[maxIndex]) maxIndex = i;
    }

    console.log(var0);
    console.log(maxIndex)

    return classes[maxIndex];
}