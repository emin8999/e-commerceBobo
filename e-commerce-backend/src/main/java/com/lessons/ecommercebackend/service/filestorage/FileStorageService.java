package com.lessons.ecommercebackend.service.filestorage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory!", ex);
        }
    }

    public String storeFile(MultipartFile file, String storeFolder, String type) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        String fileExtension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i >= 0) {
            fileExtension = originalFilename.substring(i);
        }

        String filename = UUID.randomUUID().toString() + fileExtension;

        try {
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Invalid path sequence in file name " + originalFilename);
            }

            Path targetDir = this.fileStorageLocation.resolve(Paths.get(storeFolder, type)).normalize();
            Files.createDirectories(targetDir);

            Path targetLocation = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return Paths.get(storeFolder, type, filename).toString().replace("\\", "/");
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

}
