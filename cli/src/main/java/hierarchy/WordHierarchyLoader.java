package hierarchy;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public class WordHierarchyLoader {
  private Map<String, Object> hierarchy;

  public void loadHierarchy() throws IOException {
    InputStream inputStream = getClass().getResourceAsStream("/dicts/hierarchy.json");
    if(inputStream == null) {
      throw new IOException("Arquivo não encontrado no JAR");
    }
    ObjectMapper objectMapper = new ObjectMapper();
    hierarchy = objectMapper.readValue(inputStream, Map.class);
  }
  public Map<String, Object> getHierarchy() {
    return hierarchy;
  }
}
