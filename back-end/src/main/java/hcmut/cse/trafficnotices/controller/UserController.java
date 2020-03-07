package hcmut.cse.trafficnotices.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.dto.UserDTO;
import hcmut.cse.trafficnotices.entity.User;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.JwtService;
import hcmut.cse.trafficnotices.service.UserService;
import hcmut.cse.trafficnotices.util.RestUtils;
import net.minidev.json.JSONObject;

@RestController
@RequestMapping("/api/users")
public class UserController {
  
  @Autowired
  private JwtService jwtService;
  @Autowired
  private UserService userService;
  
  /* ---------------- GET ALL USER ------------------------ */
  @GetMapping(value = "")
  public Response<Page<UserDTO>> getAllUser(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size) {
    return new Response<Page<UserDTO>>(200, "Success", userService.findAllPaging(page ,size));
  }
  
  /* ---------------- GET USER BY ID ------------------------ */
  @GetMapping(value = "/{id}")
  public Response<User> getUserById(@PathVariable String id) {
    User user = userService.findById(id);
    if (user != null) {
      return new Response<User>(200, "Success", user);  
    }
    return new Response<User>(204, "Not Found User", null); 
  }
  
  /* ---------------- CREATE NEW USER ------------------------ */
  @PostMapping(value = "")
  public Response<Object> createUser(@Valid @RequestBody User user) {
    return RestUtils.createRestOutput(userService.save(user));
  }
  
  /* ---------------- UPDATE RECORD ------------------------ */
  @PutMapping(value = "/update")
  public Response<User> updateRecord(@RequestBody User user) {
    User result = userService.updateUser(user);
    if (result != null) {
      return new Response<User>(201, "Success", result);
    } else {
      return new Response<User>(400, "Error", result);
    }
  }
  
  /* ---------------- DELETE USER ------------------------ */
  @DeleteMapping(value = "/{id}" )
  public Response<String> deleteUserById(@PathVariable String id) {
    if(userService.delete(id)) {
      return new Response<String>(200, "Deleted", null);   
    }
    else {
      return new Response<String>(400, "Error", null);   
    }
    
  }
  
  @PostMapping(value = "/login")
  public Response<JSONObject> login(HttpServletRequest request, @RequestBody User user) {
    String result = "";
    int httpStatus ;
    JSONObject data = null;
    try {
      User userLogin = userService.checkLogin(user);
      if (userLogin != null) {
        result = "Login successful";
        String token = jwtService.generateTokenLogin(user.getUsername());
        UserDTO userDTO = userService.toDTO(userLogin);
        data = new JSONObject();
        data.put("user",userDTO);
        data.put("token",token);
        httpStatus = 200 ;//HttpStatus.OK;
      } else {
        result = "Wrong userId and password";
        httpStatus = 400;//HttpStatus.BAD_REQUEST;
      }
    } catch (Exception ex) {
      result = "Server Error";
      httpStatus = 500;//HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return new  Response<JSONObject>(httpStatus, result, data);
  }
}