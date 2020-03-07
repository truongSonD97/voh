package hcmut.cse.trafficnotices.config;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;

@Configuration
public class SpringMongoConfig {
    @Resource
    public Environment environment;
    @Autowired
    MongoDbFactory mongoDbFactory;
    @Autowired
    MongoMappingContext mongoMappingContext;

//    @Value("${spring.data.mongodb.uri}")
//    private String mongoUri = environment.getProperty("spring.data.mongodb.uri");
//
//    @Value("${spring.data.mongodb.database}")
//    private String mongoDatabase = environment.getProperty("spring.data.mongodb.database");
//
    @Bean
    public MappingMongoConverter mappingMongoConverter() {

        DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDbFactory);
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
        return converter;
    }

    @Bean
    public MongoClient mongoClient() {
        String mongoUri = environment.getProperty("spring.data.mongodb.uri");
        MongoClientURI connectionString = new MongoClientURI(mongoUri);
        return new MongoClient(connectionString);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        String mongoDatabase = environment.getProperty("spring.data.mongodb.database");
        return new MongoTemplate(mongoClient(), mongoDatabase);
    }

    @Bean
    public MongoDbFactory mongoDbFactory() {
        String mongoDatabase = environment.getProperty("spring.data.mongodb.database");
        return new SimpleMongoDbFactory(mongoClient(), mongoDatabase);
    }

    @Bean
    public MongoDatabase mongoDatabase() {
        return mongoDbFactory.getDb();
    }

    @Bean
    public GridFsTemplate gridFsTemplate() {
        return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
    }

    @Bean
    public GridFSBucket gridFSBucket() {
        return GridFSBuckets.create(mongoDatabase());
    }

    
}


