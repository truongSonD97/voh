package hcmut.cse.trafficnotices.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.entity.Reason;
import hcmut.cse.trafficnotices.repository.ReasonsRepository;

@Service
public class ReasonService {
  
  @Autowired
  private ReasonsRepository reasonsRepository;
  
  public List<Reason> findAll(){
    return reasonsRepository.findAll(Sort.by(Sort.Direction.DESC, "created_on"));
  }
  
  public Reason findByName(String name){
    return reasonsRepository.findByName(name);
  }
  
  public Reason save(Reason reason) {
    try {
      return reasonsRepository.save(reason);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }
  
  public Reason updateReason(Reason reason) {
    Optional<Reason> result = reasonsRepository.findById(reason.getId());
    if(result != null && result.isPresent()) {
      if(reason.getName() != null) {
        result.get().setName(reason.getName() );
      }        
      try {
        return reasonsRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  
  public boolean delete(String id) {
    Optional<Reason> reason = reasonsRepository.findById(id);
    if(reason != null && reason.isPresent()) {
      reasonsRepository.deleteById(id);
      return true;
    }else
      return false;
  }
}
