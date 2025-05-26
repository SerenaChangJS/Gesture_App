if (!document.getElementById("gesture_canvas")) {
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

    let context = canvas.getContext("2d");
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    let drawing = false;
    let points = [];
    let reader = false;
    let originalStyle = null;
    let zoomed = false;

    // escape key = exit/cancel + stop speech
    document.addEventListener("keydown", (e) =>{
        if (e.key === "Escape") {
            if (speechSynthesis.speaking) speechSynthesis.cancel();
            cleanup();
            console.log("Stopped speaking and cleaned up");
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

        const features = extractFeatures(points);
        const model = await(await (fetch(chrome.runtime.getURL("gesture_model.json")))).json();
        const gesture = model_classify(features, model);

        console.log("Classification finished : ", gesture)

        browser_action(gesture);
        cleanup();
    });

    // gesture function
    function browser_action(gesture){
        switch(gesture){
            case 'o':
                console.log(zoomed);
                if (!zoomed) {
                    document.body.style.zoom = "120%";
                    console.log("Zoomed in");
                    zoomed = true;
                }
                else {
                    document.body.style.zoom = "100%";
                    console.log("Zoomed out");
                    zoomed = false;
                }
                console.log(zoomed);
                break;
            case ']' : 
                const message = new SpeechSynthesisUtterance(document.body.innerText.slice(0,1000));
                speechSynthesis.speak(message);
                console.log("Start speaking");
                break;
            case '[' : 
                if (!reader) {
                    reader_mode();
                    console.log("Reader mode activated");
                    reader = true;
                }
                else {
                    document.replaceChild(originalStyle, document.documentElement);
                    console.log("Reader mode deactivated");
                    reader = false;
                }
                break;
            default : 
                console.log("Error : Unknown gesture - ", gesture);
        }
    }

    function reader_mode() {

        originalStyle = document.document.cloneNode(true);

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
    
        document.body.innerHTML = ''; 
        document.body.appendChild(mainContent);
    
        Object.assign(document.body.style, {
            margin: '0',
            padding: '0',
            backgroundColor: '#fefefe',
            fontFamily: 'Georgia, serif',
            lineHeight: '1.6',
            fontSize: '18px',
            color: '#222',
        });
    
        Object.assign(mainContent.style, {
            margin: '2em auto',
            maxWidth: '700px',
            backgroundColor: '#fff',
            padding: '2em',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        });
    
        reader = true;
        console.log("Reader mode activated.");
    }
    
    // close canvas
    function cleanup() {
        canvas.remove();
    }
}