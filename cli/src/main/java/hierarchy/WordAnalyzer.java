package hierarchy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WordAnalyzer {
  private final Map<String, Object> hierarchy;
  private final Map<String, Integer> hierarchyCount = new HashMap<String, Integer>();

  public WordAnalyzer(Map<String, Object> hierarchy) {
    this.hierarchy = hierarchy;
  }

  public void analyze(String phrase, int depth) {
    String[] words = phrase.split("\\s+");
    analyzeAtDepth(hierarchy, words, depth, 0);
  }

  private void analyzeAtDepth(Map<String, Object> currentHierarchy, String[] words, int maxDepth, int currentDepth) {
    if(currentDepth != maxDepth) {
      for (Map.Entry<String, Object> entry : currentHierarchy.entrySet()) {
        if (entry.getValue() instanceof Map) {
          analyzeAtDepth((Map<String, Object>) entry.getValue(), words, maxDepth, currentDepth + 1);
        }
      }
    }
    for (Map.Entry<String, Object> entry : currentHierarchy.entrySet()) {
      Object value = entry.getValue();
      String key = entry.getKey();

      for (String word : words) {
        if (value instanceof List) {
          List<String> list = (List<String>) value;
          if (list.stream().anyMatch(item -> item.equalsIgnoreCase(word))) {
            hierarchyCount.put(key, hierarchyCount.getOrDefault(key, 0) + 1);
          }
        }
      }
    }
  }

  public void printWordCount() {
    for (String word : hierarchyCount.keySet()) {
      System.out.println(word + ": " + hierarchyCount.get(word));
    }
  }

}
