package com.GramWork.laborer.profile.Services;

import com.GramWork.laborer.profile.DTO.DocumentResponse;
import com.GramWork.laborer.profile.model.Documents;
import org.springframework.stereotype.Service;

import java.util.List;
public interface AdminService {

     List<DocumentResponse> getListDocuments();

    String acceptDocuments(String id);

    String rejectDocuments(String id, String reason);
}
