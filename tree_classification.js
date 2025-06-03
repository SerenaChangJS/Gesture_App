function classification(input) {

    var var0;

    // find highest probability
    
    if (input[0] <= 91.62751770019531) {
        if (input[2] <= 0.6903620064258575) {
            var0 = [0.0, 0.0, 1.0];
        } else {
            var0 = [0.0, 1.0, 0.0];
        }
    } else {
        if (input[2] <= 0.5127543210983276) {
            if (input[1] <= 1.3546926379203796) {
                if (input[0] <= 95.83488845825195) {
                    if (input[1] <= 0.44056276977062225) {
                        var0 = [1.0, 0.0, 0.0];
                    } else {
                        var0 = [0.0, 0.0, 1.0];
                    }
                } else {
                    if (input[2] <= 0.4675300717353821) {
                        var0 = [0.9965635738831615, 0.003436426116838488, 0.0];
                    } else {
                        var0 = [0.7777777777777778, 0.2222222222222222, 0.0];
                    }
                }
            } else {
                var0 = [0.0, 0.0, 1.0];
            }
        } else {
            if (input[2] <= 0.520991325378418) {
                if (input[0] <= 153.74794387817383) {
                    var0 = [0.0, 0.0, 1.0];
                } else {
                    var0 = [0.0, 1.0, 0.0];
                }
            } else {
                if (input[1] <= 0.6096787750720978) {
                    var0 = [0.0, 1.0, 0.0];
                } else {
                    if (input[1] <= 0.6107486188411713) {
                        var0 = [1.0, 0.0, 0.0];
                    } else {
                        var0 = [0.024096385542168676, 0.9759036144578314, 0.0];
                    }
                }
            }
        }
    }

    console.log(var0)

    const classes = ['[', ']', 'o'];
    let maxIndex = 0;
    for (let i=1; i<var0.length; i++){
        if (var0[i] > var0[maxIndex]) maxIndex = i;
    }

    console.log(var0);
    console.log(maxIndex)

    return classes[maxIndex];
}