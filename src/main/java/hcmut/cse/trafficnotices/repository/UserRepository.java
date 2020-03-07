package hcmut.cse.trafficnotices.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
    public Optional<User> findById(String id);
    public User findByUsername(String username);
}
