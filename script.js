const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Servir les fichiers statiques

app.post('/cut-video', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    const segmentDuration = parseInt(req.body.segmentDuration);
    const outputDir = 'output/';
    const outputSegments = [];

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    // Obtenir la durée de la vidéo avec ffmpeg
    ffmpeg.ffprobe(videoPath, function(err, metadata) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture des métadonnées vidéo.' });
        }

        const videoDuration = metadata.format.duration;
        let segmentIndex = 0;
        
        for (let startTime = 0; startTime < videoDuration; startTime += segmentDuration) {
            segmentIndex++;
            const outputFile = path.join(outputDir, `segment${segmentIndex}.mp4`);
            outputSegments.push(outputFile);

            ffmpeg(videoPath)
                .setStartTime(startTime)
                .setDuration(segmentDuration)
                .output(outputFile)
                .on('end', () => {
                    if (startTime + segmentDuration >= videoDuration) {
                        res.json({ segments: outputSegments.map(segment => `/${segment}`) });
                    }
                })
                .run();
        }
    });
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
