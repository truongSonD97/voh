package hcmut.cse.trafficnotices.service;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.dto.UserDTO;
import hcmut.cse.trafficnotices.entity.User;
import hcmut.cse.trafficnotices.repository.UserRepository;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.ErrorDescMap;

@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private PasswordEncoder passwordEncoder;
  
  public List<UserDTO> findAll(){
    ModelMapper modelMapper = new ModelMapper();
    List<User> userlist =  userRepository.findAll(Sort.by(Sort.Direction.DESC, "created_on"));
    Type listType = new TypeToken<List<UserDTO>>(){}.getType();
    return modelMapper.map(userlist, listType);
  }
  
  public Page<UserDTO> findAllPaging(int page, int size){
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size, Sort.by(Sort.Direction.DESC, "created_on"));
    Page<User> userlist = userRepository.findAll(request);
    Page<UserDTO> dtoPage = userlist.map(new Function<User, UserDTO>() {
      @Override
      public UserDTO apply(User entity) {
        return toDTO(entity);
      }
    });
    return dtoPage;
  }

  
  public User findById(String id) {
    Optional<User> user = userRepository.findById(id);
    if(user.isEmpty()) 
      return null;
    else
      return user.get();
  }
  
  public Map<String, Object> save(User user) {
    Map<String, Object> output = new HashMap<String, Object>();
    User result = userRepository.findByUsername(user.getUsername());
    if(result != null) {
      output.put(Constants.ERROR_CODE, ErrorDescMap.FAILURE_USERNAME_EXISTED);
    }
    else {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      output.put(Constants.ERROR_CODE, ErrorDescMap.CREATED);
      output.put(Constants.DATA, userRepository.save(user));
    }
    return output;
  }
  
  public UserDTO toDTO(User user) {
    UserDTO userDTO = new UserDTO();
    BeanUtils.copyProperties(user, userDTO);
    return userDTO;
  }
  
  public boolean delete(String id) {
    Optional<User> user = userRepository.findById(id);
    if(user != null && user.isPresent()) {
      userRepository.deleteById(id);
      return true;
    }else {
      return false;
    }
  }
  
  public User loadUserByUsername(String username) {
    User result = userRepository.findByUsername(username);
    if(result == null) 
      return null;
    else
      return result;
  }
  
  public User updateUser(User user) {
    Optional<User> result = userRepository.findById(user.getId());
    if(result != null && result.isPresent()) {
      if(user.getUsername() != null) {
        result.get().setUsername(user.getUsername());
      }
      if(user.getName()!= null) {
        result.get().setName(user.getName());
      }      
      if(user.getPhoneNumber() != null) {
        result.get().setPhoneNumber(user.getPhoneNumber());
      }      
      if(user.getPassword() != null) {
        result.get().setPassword(passwordEncoder.encode(user.getPassword()));
      }    
      if(user.getRole() != null) {
        result.get().setRole(user.getRole());
      }    
      try {
        return userRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  
  public User checkLogin(User user) {
    User result = userRepository.findByUsername(user.getUsername());
    if(result == null) {
      return null;
    }
    else{
      if(passwordEncoder.matches(user.getPassword(),result.getPassword())) {
        return result;
      }
      else {
        return null;
      }
    }
  }
}
