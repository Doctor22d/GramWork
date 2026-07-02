package com.GramWork.laborer.profile.Controller;

import com.GramWork.laborer.profile.DTO.LocationUpdateRequest;
import com.GramWork.laborer.profile.DTO.RequestUpdate;
import com.GramWork.laborer.profile.DTO.RequestWorker;
import com.GramWork.laborer.profile.Repository.workerRepository;
import com.GramWork.laborer.profile.Services.WorkerService;
import com.GramWork.laborer.profile.model.Availability;
import com.GramWork.laborer.profile.model.DocumentType;
import com.GramWork.laborer.profile.model.WorkerProfile;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.beans.ExceptionListener;
import java.util.Locale;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
public class WorkerController {
    public final WorkerService workerService;
    @PostMapping("/register-worker")
    public ResponseEntity<?> registerWorker(@RequestBody RequestWorker requestWorker){
        String result=workerService.addWorker(requestWorker);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/get-worker/{id}")
    public ResponseEntity<?> getWorker(@PathVariable("id") String id){
        WorkerProfile worker=workerService.getProfile(id);
        return new ResponseEntity<>(worker, HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String userId,
            @RequestBody RequestUpdate requestWorker
    ) {
        String res= workerService.updateProfile(userId, requestWorker);
        return new ResponseEntity<>(res,HttpStatus.OK);
    }
    @GetMapping("/{id}/checkWorkerID")
    public ResponseEntity<?> checkWorkerID(@PathVariable("id") String id){
        String res=workerService.checkID(id);
        return new ResponseEntity<>(res,HttpStatus.OK);
    }

    @PutMapping("/location")
    public ResponseEntity<?> updateLocation(@RequestParam String userId,
            @RequestBody LocationUpdateRequest locationUpdateRequest){
        String res = workerService.updateLocation(userId,locationUpdateRequest);
        return new ResponseEntity<>(res,HttpStatus.OK);
    }
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable("id") String id, @RequestBody Availability status){
        workerService.upadteAvail(id,status);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("/{id}/updateJobComplete")
    public ResponseEntity<?> updateJobComplete(@PathVariable("id") String id){
        try{
            workerService.updateJob(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping(value = "/sendAadhaarPDF",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> sendAadhaarPDF(@RequestParam("file") MultipartFile file,
                                            @RequestParam("userId") String userId,
                                            @RequestParam("documentType") DocumentType documentType){
        try {
            System.out.println("File Name: " + file.getOriginalFilename());
            String response=workerService.uploadAadhaar(file,userId,documentType);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}
