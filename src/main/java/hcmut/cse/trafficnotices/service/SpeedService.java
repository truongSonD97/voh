package hcmut.cse.trafficnotices.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.entity.Speed;
import hcmut.cse.trafficnotices.repository.SpeedRepository;

@Service
public class SpeedService {
  
  @Autowired
  private SpeedRepository speedRepository;
  
  public List<Speed> findAll(){
    return speedRepository.findAll(Sort.by(Sort.Direction.DESC, "created_on"));
  }
  
  public Speed save(Speed speed) {
    try {
      return speedRepository.save(speed);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }
  
  public Speed findById(String id) {
    Optional<Speed> speed = speedRepository.findById(id);
    if(speed.isEmpty()) 
      return null;
    else
      return speed.get();
  }
  
  public boolean delete(String id) {
    Optional<Speed> speed = speedRepository.findById(id);
    if(speed != null && speed.isPresent()) {
      speedRepository.deleteById(id);
      return true;
    }else {
      return false;
    }
  }
}
