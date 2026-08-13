package schoolstart.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalSchools;
    private long totalApplications;
    private Map<String, Long> applicationsByStatus;
    private long totalParents;
    private long totalChildren;
}
