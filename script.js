const videoUpload = document.getElementById('videoUpload');
const video = document.getElementById('sourceVideo');
const startCuttingButton = document.getElementById('startCutting');
const output = document.getElementById('output');

let videoURL;

// Charger la vidéo uploadée
videoUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        videoURL = URL.createObjectURL(file);
        video.src = videoURL;
        video.load();
        console.log('Vidéo chargée avec succès.');
    } else {
        console.log('Aucun fichier sélectionné.');
    }
});

// Découper la vidéo en segments de 30 secondes
startCuttingButton.addEventListener('click', () => {
    if (video.src) {
        const videoDuration = video.duration; // Durée totale de la vidéo
        const segmentDuration = 30; // Durée de chaque segment en secondes
        let currentTime = 0;
        let segmentIndex = 1;

        // Vérifier la durée de la vidéo
        console.log(`La durée totale de la vidéo est de ${videoDuration} secondes.`);

        // Réinitialiser la sortie
        output.innerHTML = '';

        // Fonction pour capturer chaque segment
        const captureSegment = () => {
            if (currentTime >= videoDuration) {
                console.log('Découpage terminé.');
                return;
            }

            const segmentEnd = Math.min(currentTime + segmentDuration, videoDuration);

            // Créer un canvas pour capturer la vidéo
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Capture le frame actuel de la vidéo
            video.currentTime = currentTime;

            video.addEventListener('seeked', () => {
                // Capture image pour ce segment
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Créer le lien pour télécharger le segment
                canvas.toBlob((blob) => {
                    const segmentURL = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = segmentURL;
                    a.download = `segment-${segmentIndex}.png`; // Format PNG pour les images extraites
                    a.innerText = `Télécharger le segment ${segmentIndex}`;
                    output.appendChild(a);
                    output.appendChild(document.createElement('br'));

                    // Passer au segment suivant
                    currentTime = segmentEnd;
                    segmentIndex++;
                    captureSegment(); // Capturer le segment suivant
                }, 'image/png');
            }, { once: true });
        };

        // Démarrer la capture des segments
        captureSegment();
        console.log('Découpage en segments démarré.');
    } else {
        alert('Veuillez d\'abord charger une vidéo.');
        console.log('Aucune vidéo n\'a été chargée.');
    }
});
