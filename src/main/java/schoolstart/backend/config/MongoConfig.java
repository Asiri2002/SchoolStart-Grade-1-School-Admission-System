package schoolstart.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.List;

import schoolstart.backend.config.conveter.LocalTimeToStringConverter;
import schoolstart.backend.config.conveter.StringToLocalTimeConverter;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(
                List.of(
                        new StringToLocalTimeConverter(),
                        new LocalTimeToStringConverter()
                )
        );
    }
}