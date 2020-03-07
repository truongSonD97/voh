package hcmut.cse.trafficnotices;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SuppressWarnings("deprecation")
@SpringBootApplication
public class TrafficNoticesApplication {
  
  @PostConstruct
  void started() {
      TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
  }
	public static void main(String[] args) {
		SpringApplication.run(TrafficNoticesApplication.class, args);
	}
	
  @Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurerAdapter() {
	        @Override
	        public void addCorsMappings(CorsRegistry registry) {
	            registry.addMapping("/**").allowedMethods("*").allowedOrigins("*");
	        }
	    };
	}
}
