package schoolstart.backend.service;


import schoolstart.backend.dto.ApplicationRequest;
import schoolstart.backend.dto.ApplicationResponse;

import schoolstart.backend.entity.*;

import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;

import schoolstart.backend.repository.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;



@Service
public class ApplicationService {



    @Autowired
    private ApplicationRepository applicationRepository;


    @Autowired
    private ChildRepository childRepository;


    @Autowired
    private SchoolRepository schoolRepository;


    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private SchoolAdminRepository schoolAdminRepository;

    @Autowired
    private NotificationService notificationService;


    // NEW
    @Autowired
    private ApplicationStatusHistoryRepository historyRepository;


    private ParentModel getParentByUserId(String userId) {
        return parentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parent profile not found"
                        ));
    }


    // CREATE APPLICATION

    @Transactional
    public ApplicationResponse createApplication(
            String userId,
            ApplicationRequest request
    ) {

        ParentModel parent =
                getParentByUserId(userId);

        ChildModel child =
                childRepository.findById(request.getChildId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Child not found"
                                ));

        // Check ownership

        if(!child.getParentId()
                .equals(parent.getId())) {

            throw new BadRequestException(
                    "You cannot apply for this child"
            );
        }

        SchoolModel school =
                schoolRepository.findById(request.getSchoolId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "School not found"
                                ));


        // Duplicate application check

        List<ApplicationModel> applications =
                applicationRepository
                        .findByChildId(child.getId());

        boolean exists =
                applications.stream()
                        .anyMatch(app ->
                                app.getSchoolId()
                                        .equals(school.getId())
                        );

        if(exists){
            throw new BadRequestException(
                    "Already applied to this school"
            );
        }

        ApplicationModel application =
                ApplicationModel.builder()

                        .childId(child.getId())
                        .schoolId(school.getId())
                        .parentId(parent.getId())


                        // Child details

                        .childFullName(
                                child.getFirstName()
                                        +" "
                                        +child.getLastName()
                        )
                        .birthDate(
                                child.getDateOfBirth()
                                        .toString()
                        )
                        .gender(
                                child.getGender()
                        )

                        // Parent details

                        .parentFullName(
                                parent.getFirstName()
                                        +" "
                                        +parent.getLastName()
                        )
                        .relationship(
                                request.getRelationship()
                        )
                        .nicNumber(
                                request.getNicNumber()
                        )
                        .contactNumber(
                                request.getContactNumber()
                        )
                        .status(
                                ApplicationStatus.SUBMITTED
                        )
                        .submissionDate(
                                LocalDateTime.now()
                        )
                        .build();

        // Save application
        ApplicationModel saved =
                applicationRepository.save(application);


        // Notify all school admins
        List<SchoolAdminModel> schoolAdmins =
                schoolAdminRepository.findBySchoolId(saved.getSchoolId());

        for (SchoolAdminModel admin : schoolAdmins) {

            notificationService.createNotification(
                    admin.getUserId(),
                    "A new application has been submitted by "
                            + parent.getFirstName()
                            + " "
                            + parent.getLastName(),
                    "APPLICATION"
            );
        }

// CREATE FIRST STATUS HISTORY
        ApplicationStatusHistory history =
                ApplicationStatusHistory.builder()
                        .applicationId(saved.getId())
                        .status(saved.getStatus())
                        .updatedAt(LocalDateTime.now())
                        .build();

        historyRepository.save(history);

        // Update child applications list
        child.getApplicationIds()
                .add(saved.getId());
        childRepository.save(child);
        return mapToResponse(saved);
    }


    // GET MY APPLICATIONS

    public List<ApplicationResponse> getMyApplications(
            String userId
    ){
        ParentModel parent =
                getParentByUserId(userId);

        return applicationRepository
                .findByParentId(parent.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // GET SINGLE APPLICATION
    public ApplicationResponse getMyApplication(
            String id,
            String userId
    ){
        ParentModel parent =
                getParentByUserId(userId);
        ApplicationModel application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));
        if(!application.getParentId()
                .equals(parent.getId())) {
            throw new BadRequestException(
                    "You cannot view this application"
            );
        }
        return mapToResponse(application);
    }


    // UPDATE APPLICATION
    @Transactional
    public ApplicationResponse updateApplication(
            String id,
            String userId,
            ApplicationRequest request
    ) {

        ParentModel parent = getParentByUserId(userId);

        ApplicationModel application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found"));

        if (!application.getParentId().equals(parent.getId())) {
            throw new BadRequestException("You cannot update this application");
        }

        ChildModel child = childRepository.findById(request.getChildId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Child not found"));

        if (!child.getParentId().equals(parent.getId())) {
            throw new BadRequestException("You cannot update this child");
        }

        SchoolModel school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        // Update child details
        String[] childName = request.getChildFullName().trim().split("\\s+", 2);

        child.setFirstName(childName[0]);

        if (childName.length > 1) {
            child.setLastName(childName[1]);
        }

        child.setDateOfBirth(java.time.LocalDate.parse(request.getBirthDate()));
        child.setGender(request.getGender());

        childRepository.save(child);

        // Update parent details
        String[] parentName = request.getParentFullName().trim().split("\\s+", 2);

        parent.setFirstName(parentName[0]);

        if (parentName.length > 1) {
            parent.setLastName(parentName[1]);
        }

        parent.setPhone(request.getContactNumber());

        parentRepository.save(parent);

        // Update application
        application.setChildId(child.getId());
        application.setSchoolId(school.getId());

        application.setChildFullName(request.getChildFullName());
        application.setBirthDate(request.getBirthDate());
        application.setGender(request.getGender());

        application.setParentFullName(request.getParentFullName());
        application.setRelationship(request.getRelationship());
        application.setNicNumber(request.getNicNumber());
        application.setContactNumber(request.getContactNumber());

        ApplicationModel updated = applicationRepository.save(application);

        return mapToResponse(updated);
    }


    // ADMIN UPDATE STATUS
    @Transactional
    public ApplicationResponse updateStatus(
            String applicationId,
            ApplicationStatus status
    ){
        ApplicationModel application =
                applicationRepository.findById(applicationId)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));
        application.setStatus(status);
        ApplicationModel saved =
                applicationRepository.save(application);



        // Add history record
        ApplicationStatusHistory history =
                ApplicationStatusHistory.builder()
                        .applicationId(
                                saved.getId()
                        )
                        .status(
                                status
                        )
                        .updatedAt(
                                LocalDateTime.now()
                        )
                        .build();
        historyRepository.save(history);
        return mapToResponse(saved);
    }

    // RESPONSE MAPPING
    private ApplicationResponse mapToResponse(
            ApplicationModel app
    ){
        return ApplicationResponse.builder()
                .id(app.getId())
                .childId(app.getChildId())
                .schoolId(app.getSchoolId())
                .parentId(app.getParentId())
                .childFullName(
                        app.getChildFullName()
                )
                .birthDate(
                        app.getBirthDate()
                )
                .gender(
                        app.getGender()
                )
                .parentFullName(
                        app.getParentFullName()
                )
                .relationship(
                        app.getRelationship()
                )
                .nicNumber(
                        app.getNicNumber()
                )
                .contactNumber(
                        app.getContactNumber()
                )
                .status(
                        app.getStatus()
                )
                .submissionDate(
                        app.getSubmissionDate()
                )
                .documentIds(
                        app.getDocumentIds()
                )
                .build();

    }
}