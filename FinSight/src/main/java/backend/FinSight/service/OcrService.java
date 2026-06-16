package backend.FinSight.service;

import com.google.cloud.vision.v1.*;

import com.google.protobuf.ByteString;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

@Service
public class OcrService {

    public String extractText(
            MultipartFile file
    ) throws Exception {

        ByteString imgBytes =
                ByteString.readFrom(
                        file.getInputStream()
                );

        Image img =
                Image.newBuilder()
                        .setContent(imgBytes)
                        .build();

        Feature feature =
                Feature.newBuilder()
                        .setType(
                                Feature.Type.TEXT_DETECTION
                        )
                        .build();

        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder()
                        .addFeatures(feature)
                        .setImage(img)
                        .build();

        try (ImageAnnotatorClient vision =
                     ImageAnnotatorClient.create()) {

            BatchAnnotateImagesResponse response =
                    vision.batchAnnotateImages(
                            Collections.singletonList(request)
                    );

            AnnotateImageResponse res =
                    response.getResponsesList().get(0);

            if (res.hasError()) {

                throw new RuntimeException(
                        res.getError().getMessage()
                );
            }

            return res
                    .getFullTextAnnotation()
                    .getText();
        }
    }
}
