package com.GramWork.laborer.profile.Controller;

import com.GramWork.laborer.profile.DTO.DocumentResponse;
import com.GramWork.laborer.profile.DTO.RejectRequest;
import com.GramWork.laborer.profile.Services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/get/pendingDocuments")
    public ResponseEntity<?> getPendingDocuments() {
        try {
            List<DocumentResponse> documentsList = adminService.getListDocuments();
            return ResponseEntity.ok().body(documentsList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/accept/{id}/document")
    public ResponseEntity<?> acceptDocument(@PathVariable String id) {
        try {
            String response = adminService.acceptDocuments(id);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/reject/{id}/document")
    public ResponseEntity<?> rejectDocument(
            @PathVariable String id,
            @RequestBody RejectRequest rejectRequest) {
        try {
            String response = adminService.rejectDocuments(id, rejectRequest.getReason());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
