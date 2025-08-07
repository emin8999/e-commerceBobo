package com.e_commerce_backend.util;

import com.e_commerce_backend.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductUtility {

    private final CloudinaryService cloudinaryService;

    public List<String> saveProductImages(List<MultipartFile> images, Long storeId, Long productId) {
        List<String> imageUrls = new ArrayList<>();
        String folderPath = "image/store_" + storeId + "/product_" + productId;

        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);
            String publicId = "product_" + i;
            String imageUrl = cloudinaryService.uploadFile(image, folderPath, publicId);
            imageUrls.add(imageUrl);
        }

        return imageUrls;
    }
}
