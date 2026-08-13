package schoolstart.backend.repository;

import schoolstart.backend.entity.ChildModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends MongoRepository<ChildModel, String> {
    List<ChildModel> findByParentId(String parentId);
}
