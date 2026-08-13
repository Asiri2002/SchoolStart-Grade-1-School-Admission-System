package schoolstart.backend.config.conveter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

import java.time.LocalTime;

@WritingConverter
public class LocalTimeToStringConverter implements Converter<LocalTime, String> {

    @Override
    public String convert(LocalTime source) {
        return source.toString();
    }
}