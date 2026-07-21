package schoolstart.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentDashboardDto {

    private String parentName;

    private DashboardStatsDto stats;

    private List<ChildDto> children;

    private List<ApplicationResponse> recentApplications;
}
