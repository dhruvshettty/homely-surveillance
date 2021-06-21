const video = document.getElementById('videoInput')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Face recg. on extraction
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Face extraction
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'), // Face detection
]).then(start);

function start() {
    document.body.append('Models Loaded');

    navigator.getUserMedia(
        { video: {} },
        (stream) => video.srcObject = stream,
        (err) => console.error(err),
    );

    console.log('video added');
    recognizeFaces();
}

async function recognizeFaces() {
    const labeledDescriptors = await loadLabeledImages();
    // console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);

    video.addEventListener('play', async () => {
        console.log('Playing');
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video)
                .withFaceLandmarks()
                .withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
                console.log(result);
                drawBox.draw(canvas);
                setTimeout(() => {
                    if (result.label === 'unknown') {
                        document.location = 'http://localhost:3000/verification/owner-verify';
                    } else {
                        document.location = 'http://localhost:3000/verification/success';
                    }
                }, 3000);
            });
        }, 100);
    });
}

function loadLabeledImages() {
    const labels = ['Dhruv']; // for WebCam
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = [];
            const score = [];
            for (let i = 1; i <= 4; i += 1) {
                const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                // console.log(label + "  " + i + "  " + JSON.stringify(detections))
                descriptions.push(detections.descriptor);
                score.push(detections.detection._score);
            }
            console.log(score[3]);
            document.body.append(' Faces Loaded | ');
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        }),
    );
}
