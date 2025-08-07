package com.e_commerce_backend.dto.responseDto.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderTrackingDto {

    private String trackingNumber;
    private String carrierName;
    private String carrierUrl;
    private List<TrackingEventDto> events;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TrackingEventDto {

    private String status;
    private String description;
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

}
