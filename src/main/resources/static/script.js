console.log("✅ JavaScript wurde geladen");

function checkFiles(files) {
    if (files.length !== 1) {
        alert("Bitte genau eine Datei hochladen.");
        return;
    }

    const file = files[0];
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > 10) {
        alert("Datei zu groß (max. 10MB).");
        return;
    }

    document.getElementById("preview").src = URL.createObjectURL(file);
    document.getElementById("answerPart").style.display = "block";

    const formData = new FormData();
    formData.append("image", file);

    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        try {
            // ⬇️ WICHTIG: JSON-Text in Objekt umwandeln
            const predictions = JSON.parse(text);
            console.log("📊 Vorhersagen:", predictions);
            renderPrediction(predictions);
        } catch (err) {
            console.error("❌ Fehler beim Parsen:", err);
            document.getElementById("answer").innerHTML =
                "<p class='text-danger'>⚠️ Fehler beim Verarbeiten der Antwort</p>";
        }
    })
    .catch(error => {
        console.error("❌ Fehler beim Analysieren:", error);
        document.getElementById("answer").innerHTML =
            "<p class='text-danger'>⚠️ Fehler beim Analysieren der Antwort</p>";
    });
}

function renderPrediction(predictions) {
    if (!Array.isArray(predictions)) {
        document.getElementById("answer").innerText = "Keine gültigen Vorhersagen.";
        return;
    }

    predictions.sort((a, b) => b.probability - a.probability);

    let table = `<table class="table table-bordered mt-3">
        <thead class="thead-light">
            <tr><th>🇺🇳 Land</th><th>📊 Wahrscheinlichkeit</th></tr>
        </thead><tbody>`;

    predictions.forEach((p, index) => {
        const percent = (p.probability * 100).toFixed(2) + "%";
        const highlight = index === 0 ? "table-success font-weight-bold" : "";
        table += `<tr class="${highlight}"><td>${p.className}</td><td>${percent}</td></tr>`;
    });

    table += "</tbody></table>";

    document.getElementById("answer").innerHTML = table;
}
