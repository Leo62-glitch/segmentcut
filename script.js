function generateSegments() {
    const fileInput = document.getElementById('videoFile');
    const segmentDuration = parseInt(document.getElementById('segmentDuration').value);
    const segmentsList = document.getElementById('segmentsList');
    segmentsList.innerHTML = ''; // Vider la liste de segments précédents

    if (!fileInput.files.length) {
        alert('Veuillez sélectionner une vidéo.');
        return;
    }

    const videoFile = fileInput.files[0];
    const videoURL = URL.createObjectURL(videoFile);
    const video = document.createElement('video');

    video.src = videoURL;
    video.onloadedmetadata = () => {
        const videoDuration = Math.floor(video.duration); // Durée de la vidéo en secondes
        let segmentNumber = 1;

        for (let start = 0; start < videoDuration; start += segmentDuration) {
            const end = Math.min(start + segmentDuration, videoDuration);
            const segmentItem = document.createElement('li');
            segmentItem.textContent = `Segment ${segmentNumber}: de ${start}s à ${end}s`;
            segmentsList.appendChild(segmentItem);
            segmentNumber++;
        }
    };
}
