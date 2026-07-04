package com.GramWork.Auth.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Admin")
public class Admin {
    @Id
    private String id;
    private String username;
    private String password;
    @Builder.Default
    private Role role=Role.Admin;
}
