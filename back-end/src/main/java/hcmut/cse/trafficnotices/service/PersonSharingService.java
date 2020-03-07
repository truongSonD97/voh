package hcmut.cse.trafficnotices.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.entity.PersonSharing;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.repository.PersonSharingRepository;
import hcmut.cse.trafficnotices.repository.RecordRepository;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.ErrorDescMap;
import hcmut.cse.trafficnotices.util.StringSimilarity;

@Service
public class PersonSharingService {
  @Autowired
  private PersonSharingRepository personSharingRepository;
  
  @Autowired
  private RecordRepository recordRepository;
  
  public List<PersonSharing> findAll(){
    return personSharingRepository.findAll(Sort.by(Sort.Direction.DESC, "created_on"));
  }
  
  public Map<String, Object> save(PersonSharing personSharing) {
    Map<String, Object> output = new HashMap<String, Object>();
    try {
      List<PersonSharing> result = personSharingRepository.findByPhoneNumber(personSharing.getPhoneNumber());
      if(!result.isEmpty()) {
        PersonSharing returnPerson = result.get(0);
        if(StringSimilarity.similarity(returnPerson.getName(), personSharing.getName())>0.69f) {
          output.put(Constants.ERROR_CODE, ErrorDescMap.SUCCESSFUL);
          output.put(Constants.DATA, returnPerson);
        }else {
          output.put(Constants.ERROR_CODE, ErrorDescMap.FAILURE_PHONE_NUMBER_EXISTED);
          output.put(Constants.DATA, returnPerson.getName());
        }
      }
      else {
        output.put(Constants.ERROR_CODE, ErrorDescMap.CREATED);
        output.put(Constants.DATA, personSharingRepository.save(personSharing));
      }
    } catch (Exception e) {
      System.out.println(e.getMessage());
      output.put(Constants.ERROR_CODE,ErrorDescMap.FAILURE_EXCEPTION);
    }
    return output;
  }
  
  public Map<String, Object> findSame(String phone) {
    Map<String, Object> output = new HashMap<String, Object>();
    List<PersonSharing> perList = personSharingRepository.findAll();
    Integer sizeElement = 0;
    Integer recordSize = 0;
//    for(PersonSharing person : perList) {
      List<PersonSharing> result = personSharingRepository.findByNameRegex(phone);
      if(result.size() > 1) {
        PersonSharing per = result.get(0);
        result.remove(0);
        if(!result.isEmpty()) {
          List<Record> records = recordRepository.findByPersonSharingIn(result);
          for(Record record : records) {
            record.setPersonSharing(per);
            recordRepository.save(record);
          }
          for(PersonSharing delete : result) {
            personSharingRepository.delete(delete);
          }
          recordSize+= records.size();
          sizeElement+= result.size();
        }
      }
//    }
    output.put("recordSize", recordSize);
    output.put("size", sizeElement);
    return output;
  }
  
  public PersonSharing updatePersonSharing(PersonSharing personSharing) {
    Optional<PersonSharing> result = personSharingRepository.findById(personSharing.getId());
    if(result != null && result.isPresent()) {
      if(personSharing.getName() != null) {
        result.get().setName(personSharing.getName());
      }
      if(personSharing.getPhoneNumber() != null) {
        result.get().setPhoneNumber(personSharing.getPhoneNumber());
      }          
      try {
        return personSharingRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  
  public boolean delete(String id) {
  Optional<PersonSharing> personSharing = personSharingRepository.findById(id);
  if(personSharing != null && personSharing.isPresent()) {
    personSharingRepository.deleteById(id);
    return true;
  }else
    return false;
  }
}
