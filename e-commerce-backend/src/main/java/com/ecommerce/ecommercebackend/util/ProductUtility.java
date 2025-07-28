package com.ecommerce.ecommercebackend.util;

import lombok.NoArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;


@NoArgsConstructor
public class ProductUtility {

    public static List<String> saveProductImages(List<MultipartFile> images, Long storeId, Long productId) {
        List<String> imagePaths = new ArrayList<>();
        String basePath = "images/store_" + storeId + "/product_" + productId;
        File dir = new File(basePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        for (MultipartFile image : images) {
            try {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filepath = Paths.get(basePath, filename);
                Files.copy(image.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                imagePaths.add("/" + basePath + "/" + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image: " + image.getOriginalFilename(), e);
            }
        }

        return imagePaths;
    }
}
