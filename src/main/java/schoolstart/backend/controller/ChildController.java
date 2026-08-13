package schoolstart.backend.controller;

import schoolstart.backend.dto.ChildDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.ChildService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
@PreAuthorize("hasAuthority('PARENT')")
@CrossOrigin(origins = "*")
public class ChildController {

    @Autowired
    private ChildService childService;

    @PostMapping
    public ResponseEntity<ChildDto> addChild(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChildDto childDto) {

        ChildDto saved = childService.addChild(userPrincipal.getId(), childDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ChildDto>> getChildren(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<ChildDto> children = childService.getChildren(userPrincipal.getId());
        return ResponseEntity.ok(children);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildDto> updateChild(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody ChildDto childDto) {

        ChildDto updated = childService.updateChild(userPrincipal.getId(), id, childDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {

        childService.deleteChild(userPrincipal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}