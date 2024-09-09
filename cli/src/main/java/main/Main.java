package main;

import hierarchy.WordAnalyzer;
import hierarchy.WordHierarchyLoader;

import java.io.IOException;

public class Main {
  public static void main(String[] args) {
    if(args.length < 4) {
      System.out.println("Uso: java -jar cli.jar analyze --depth <n> \\\"{frase}\\\" [--verbose]");
      return;
    }

    String command = args[0];
    if("analyze".equals(command)) {
      try {
        int depth = Integer.parseInt(args[2]);
        String phrase =  args[3];
        boolean verbose = args.length > 4 && "--verbose".equalsIgnoreCase(args[4]);

        // Carregando json
        WordHierarchyLoader loader = new WordHierarchyLoader();
        loader.loadHierarchy();

        // Analisar frase
        long start = System.currentTimeMillis();
        WordAnalyzer analyzer = new WordAnalyzer(loader.getHierarchy());
        analyzer.analyze(phrase, depth);
        long end = System.currentTimeMillis();

        if (verbose) {
          System.out.println("Tempo de carregamento dos parâmetros: " + (end - start) + "ms");
        }

        analyzer.printWordCount();
      } catch (IOException e) {
        System.out.println("Erro ao carregar a hierarquia: " + e.getMessage());
      }
    }
  }
}
