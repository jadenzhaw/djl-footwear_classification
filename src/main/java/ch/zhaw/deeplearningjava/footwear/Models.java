package ch.zhaw.deeplearningjava.footwear;

import ai.djl.Model;
import ai.djl.basicmodelzoo.cv.classification.ResNetV1;
import ai.djl.ndarray.types.Shape;
import ai.djl.nn.Block;

import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/** A helper class loads and saves model. */
public final class Models {

    // die Anzahl Länderklassen (z. B. 24)
    public static final int NUM_OF_OUTPUT = 24;

    // Eingabe-Bildgrösse (anpassbar)
    public static final int IMAGE_HEIGHT = 100;
    public static final int IMAGE_WIDTH = 100;

    // Modellname
    public static final String MODEL_NAME = "flagclassifier";

    private Models() {}

    public static Model getModel() {
        Model model = Model.newInstance(MODEL_NAME);

        Block resNet50 = ResNetV1.builder()
                .setImageShape(new Shape(3, IMAGE_HEIGHT, IMAGE_WIDTH))
                .setNumLayers(50)
                .setOutSize(NUM_OF_OUTPUT)
                .build();

        model.setBlock(resNet50);
        return model;
    }

    public static void saveSynset(Path modelDir, List<String> synset) throws IOException {
        Path synsetFile = modelDir.resolve("synset.txt");
        try (Writer writer = Files.newBufferedWriter(synsetFile)) {
            writer.write(String.join("\n", synset));
        }
    }
}
