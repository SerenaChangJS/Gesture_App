if (typeof window.zoomed === 'undefined') {
    window.zoomed = false;
}
if (typeof window.reader === 'undefined') {
    window.reader = false;
}

if (window.reader) {
    show_feedback('none', "Exit Reader Mode to Reopen Canvas");
} 
else if (!document.getElementById("gesture_canvas")) {
    let canvas = document.createElement('canvas');
    canvas.id = "gesture_canvas";

    console.log("Canvas created");

    Object.assign(canvas.style, {
        position : "fixed", 
        top : "0", left : "0",
        zIndex: 9999,
        cursor: "crosshair",
        backgroundColor: "rgba(128, 128, 128, 0.5)",
    })
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    let gesture_list_box = document.createElement('div');
    gesture_list_box.id = "gesture_list_box";
    gesture_list_box.innerHTML = `
    <div style="
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background-color: rgba(64, 64, 64, 1.0);
    padding: 5px;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
">
    <table style="
        font-family: monospace;
        font-size: 14px;
        color: white;
        border: 1px solid #888;
        border-collapse: collapse;
    ">
            <thead>
                <tr>
                    <th style="border: 1px solid #888; padding: 6px;">Gesture</th>
                    <th style="border: 1px solid #888; padding: 6px;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #888; padding: 6px;">o</td>
                    <td style="border: 1px solid #888; padding: 6px;">Zoom In</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #888; padding: 6px;">[</td>
                    <td style="border: 1px solid #888; padding: 6px;">Reader Mode</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #888; padding: 6px;">]</td>
                    <td style="border: 1px solid #888; padding: 6px;">Text-to-Speech</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #888; padding: 6px;">Esc Key</td>
                    <td style="border: 1px solid #888; padding: 6px;">Cancel All</td>
                </tr>
            </tbody>
        </table>
    `;
    document.body.appendChild(gesture_list_box);

    let context = canvas.getContext("2d");
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    let drawing = false;
    let points = [];

    // escape key = cancel all actions (zoom, speaking, reader)
    document.addEventListener("keydown", (e) =>{
        if (e.key === "Escape") {
            if (speechSynthesis.speaking) speechSynthesis.cancel();
            document.body.style.zoom = "100%";
            if (window.reader) deactivate_reader();
            window.reader = false;
            window.zoomed = false;
            cleanup();
            console.log("Stopped speaking and cleaned up");
            show_feedback('none', "Escape Key Clicked -> Cancels All Actions");
        }
    });

    // mouse down = drawing start
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        points = [[e.clientX, e.clientY]];
        context.beginPath();
        context.moveTo(e.clientX, e.clientY);
        console.log("Start drawing");
    })

    // mouse moving = draw stroke + log points
    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        points.push([e.clientX, e.clientY]);
        context.lineTo(e.clientX, e.clientY);
        context.stroke();
    })

    // mouse up = finish drawing + gesture recognition
    canvas.addEventListener("mouseup", async () => {
        drawing = false;
        context.closePath();

        console.log("Stop drawing");
        console.log("Start classification");

        if (points.length>5) {
            const features = extractFeatures(points);
            const gesture = model_classify(features);
            console.log("Classification finished : ", gesture);
            browser_action(gesture);
            cleanup();
        }
        else {
            console.log("Too little data points")
            cleanup();
        }
    });

    // gesture function
    function browser_action(gesture){
        switch(gesture){
            case 'o':
                if (window.zoomed){
                    document.body.style.zoom = "100%";
                    console.log("Zoomed out");
                    show_feedback(gesture, "Zoomed Out");
                    window.zoomed = false;
                    break;
                }
                document.body.style.zoom = "120%";
                console.log("Zoomed in");
                show_feedback(gesture, "Zoomed In");
                window.zoomed = true;
                break;
            case ']' : 
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    console.log("Stopped speaking");
                    show_feedback(gesture, "Stopped Speaking");
                    break;
                }
                const message = new SpeechSynthesisUtterance(document.body.innerText.slice(0,1000));
                speechSynthesis.speak(message);
                console.log("Start speaking");
                show_feedback(gesture, "Start Speaking");
                break;
            case '[' : 
                if (window.reader) {
                    deactivate_reader();
                    console.log("Reader mode deactivated");
                    show_feedback(gesture, "Reader Mode Deactivated");
                    window.reader = false;
                    break;
                }
                reader_mode();
                console.log("Reader mode activated");
                show_feedback(gesture, "Reader Mode Activated");
                window.reader = true;
                break;
            default : 
                console.log("Error : Unknown gesture - ", gesture);
        }
    }

    // activated reader mode
    function reader_mode() {
        const selectors = ['article', 'main', '#content', '.content'];
        let mainContent = null;
    
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.innerText.trim().length > 200) {
                mainContent = el.cloneNode(true); 
                break;
            }
        }
    
        if (!mainContent) {
            console.warn("No readable content found. Using entire body as fallback.");
            mainContent = document.body.cloneNode(true);
        }
    
        const overlay = document.createElement('div');
        overlay.id = 'reader_overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: '#fefefe',
            zIndex: 10000,
            padding: '2em',
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#222',
        });
    
        Object.assign(mainContent.style, {
            maxWidth: '700px',
            margin: '2em auto',
            backgroundColor: '#fff',
            padding: '2em',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        });
    
        overlay.appendChild(mainContent);
        document.body.appendChild(overlay);
    }
    

    // deactivate reader mode
    function deactivate_reader() {
        const overlay = document.getElementById('reader_overlay');
        if (overlay) overlay.remove();
    }
    
    // close canvas
    function cleanup() {
        canvas.remove();
        const gesture_box = document.getElementById('gesture_list_box');
        if (gesture_box) gesture_box.remove();
    }

    // shows feedback 
    function show_feedback(gesture, text) {
        const feedback = document.createElement('div');
        if (gesture == 'none') feedback.textContent = text;
        else feedback.textContent = `Gesture '${gesture}' Detected → ${text}`;
        Object.assign(feedback.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            zIndex: 10001,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        });
    
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2500); 
    }
    
}