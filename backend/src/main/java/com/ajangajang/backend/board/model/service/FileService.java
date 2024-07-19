package com.ajangajang.backend.board.model.service;

import com.ajangajang.backend.board.model.entity.MediaType;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class FileService {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public Map<String, MediaType> uploadFile(List<MultipartFile> files) {

        Map<String, MediaType> fileUrls = new HashMap<>();

        try {
            for (MultipartFile file : files) {
                String fileName=file.getOriginalFilename();
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());
                amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
                String fileUrl = amazonS3Client.getUrl(bucket, fileName).toString();
                // return fileUrl : mediaType
                fileUrls.put(fileUrl, getMediaType(file));
            }
        } catch (IOException e) {
            fileUrls.put("error", MediaType.UNKNOWN);
            e.printStackTrace();
        }

        return fileUrls;
    }

    public void delete(String fileUrl){
        String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        DeleteObjectRequest request = new DeleteObjectRequest(bucket, fileName);
        amazonS3Client.deleteObject(request);
    }

    public void deleteFiles(List<String> fileUrls){
        for (String fileUrl : fileUrls) {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            DeleteObjectRequest request = new DeleteObjectRequest(bucket, fileName);
            amazonS3Client.deleteObject(request);
        }
    }

    public MediaType getMediaType(MultipartFile file) {
        List<String> IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
        List<String> VIDEO_TYPES = Arrays.asList("video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo");

        String mimeType = file.getContentType();

        if (IMAGE_TYPES.contains(mimeType)) {
            return MediaType.IMAGE;
        } else if (VIDEO_TYPES.contains(mimeType)) {
            return MediaType.VIDEO;
        } else {
            return MediaType.UNKNOWN;
        }
    }

}