package schoolstart.backend.controller;

import schoolstart.backend.dto.SchoolDto;
import schoolstart.backend.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@PreAuthorize("isAuthenticated()")
@CrossOrigin(origins = "*")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public ResponseEntity<List<SchoolDto>> getAllSchools() {
        List<SchoolDto> schools = schoolService.getAllSchools();
        return ResponseEntity.ok(schools);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolDto> getSchoolById(@PathVariable String id) {
        SchoolDto school = schoolService.getSchoolById(id);
        return ResponseEntity.ok(school);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SchoolDto>> searchSchools(@RequestParam String query) {
        List<SchoolDto> schools = schoolService.searchSchools(query);
        return ResponseEntity.ok(schools);
    }
}

