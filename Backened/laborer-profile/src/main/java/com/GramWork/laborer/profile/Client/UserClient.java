package com.GramWork.laborer.profile.Client;

import com.GramWork.laborer.profile.DTO.Auth;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        url = "http://localhost:8086",
        name = "Auth-Service"
)
public interface UserClient {
    @GetMapping("/api/auth/{userID}/get-user")
    Auth getUser(@PathVariable String userID);
}
