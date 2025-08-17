package com.e_commerce_backend.exception;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ErrorResponse {


    private Integer statusCode;
    private String message;
    private LocalDateTime timestamp;
    private String path;

}
