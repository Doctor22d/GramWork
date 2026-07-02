package com.GramWork.laborer.profile.Controller;

import com.GramWork.laborer.profile.DTO.*;
import com.GramWork.laborer.profile.Services.EmployerService;
import com.GramWork.laborer.profile.model.EmployerProfile;
import com.GramWork.laborer.profile.model.WorkerProfile;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
public class EmployerController {
    private final EmployerService employerService;
    @PostMapping("/register")
    public ResponseEntity<?> Jobposting(@RequestBody requestEmployer requestemployer){
        responseEmployer res=employerService.posting(requestemployer);
        return ResponseEntity.ok().body(res);
    }
    @GetMapping("/get-employer/{id}")
    public ResponseEntity<?> getEmployer(@PathVariable String id){
        try{
            EmployerProfile employerProfile=employerService.getWorker(id);
            return ResponseEntity.ok().body(employerProfile);
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/CheckEmployerID")
    public ResponseEntity<?>checkEmployerID(@PathVariable("id") String id){
        boolean res=employerService.checkID(id);
        return ResponseEntity.ok().body(res);
    }
    @PostMapping("/nearbyWorker")
    public ResponseEntity<?> getNearbyWorker(@RequestBody nearbyRequest nearby){
        List<WorkerProfile> nearbyList=employerService.findnearBY(nearby);
        return ResponseEntity.ok().body(nearbyList);
    }
    @PutMapping("/markAttendance")
    public ResponseEntity<?> markAttendance(@RequestBody requestAttendance request){
        try{
            String res=employerService.markAttendance(request);
            return ResponseEntity.ok().body(res);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/nearbyWorkerforMatching")
    public ResponseEntity<?> getNearByWorkerForMatching(@RequestParam("latitude") Double latitude, @RequestParam("longitude") Double longitude){
        try {
            List<WorkerProfile> workerProfiles=employerService.FindNearByWorkerForMatching(latitude,longitude);
            return ResponseEntity.ok().body(workerProfiles);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
