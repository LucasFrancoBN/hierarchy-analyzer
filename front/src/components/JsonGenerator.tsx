import { useState } from "react";

interface JsonNode {
  key: string;
  value: string[] | { [key: string]: JsonNode };
}

const JsonGenerator = () => {
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([]);

  const handleKeyChange = (index: number, value: string) => {
    const newJsonTree = [...jsonTree];
    newJsonTree[index].key = value;
    setJsonTree(newJsonTree);
  };

  const handleValueChange = (
    index: number,
    value: string[] | { [key: string]: JsonNode }
  ) => {
    const newJsonTree = [...jsonTree];
    newJsonTree[index].value = value;
    setJsonTree(newJsonTree);
  };

  const addRootKey = () => {
    setJsonTree([...jsonTree, { key: "", value: {} }]);
  };

  const addNestedKey = (parentIndex: number, key: string) => {
    const newJsonTree = [...jsonTree];
    const parentValue = newJsonTree[parentIndex].value as {
      [key: string]: JsonNode;
    };
    parentValue[key] = { key, value: [""] };
    newJsonTree[parentIndex].value = parentValue;
    setJsonTree(newJsonTree);
  };

  const addStringToValue = (index: number, valueIndex: number) => {
    const newJsonTree = [...jsonTree];
    const currentValue = newJsonTree[index].value as string[];
    currentValue[valueIndex] = "";
    newJsonTree[index].value = currentValue;
    setJsonTree(newJsonTree);
  };

  const generateJson = (nodes: JsonNode[]): any => {
    const result: any = {};
    nodes.forEach(({ key, value }) => {
      if (Array.isArray(value)) {
        result[key] = value; // Lista de strings
      } else {
        result[key] = generateJson(Object.values(value)); // Objeto aninhado
      }
    });
    return result;
  };

  const [jsonResult, setJsonResult] = useState<any>(null);

  const handleGenerateJson = () => {
    const result = generateJson(jsonTree);
    setJsonResult(result);
  };

  const downloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(jsonResult, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div>
      <h2>Gerador de JSON</h2>

      {jsonTree.map((node, index) => (
        <div key={index}>
          <label>
            Chave raiz:
            <input
              type="text"
              value={node.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
            />
          </label>

          {Array.isArray(node.value) ? (
            <div>
              <h4>Valores (Lista de Strings):</h4>
              {node.value.map((str, strIndex) => (
                <input
                  key={strIndex}
                  type="text"
                  value={str}
                  onChange={(e) => {
                    const newValue = [...(node.value as string[])];
                    newValue[strIndex] = e.target.value;
                    handleValueChange(index, newValue);
                  }}
                />
              ))}
              <button
                onClick={() => addStringToValue(index, node.value.length)}
              >
                Adicionar Valor
              </button>
            </div>
          ) : (
            <div>
              <h4>Chaves aninhadas:</h4>
              {Object.keys(node.value).map((nestedKey) => (
                <div key={nestedKey}>
                  <label>
                    {nestedKey}:
                    <input
                      type="text"
                      value={
                        (node.value as { [key: string]: JsonNode })[nestedKey]
                          .key
                      }
                      onChange={(e) => {
                        const currentValue = node.value as {
                          [key: string]: JsonNode;
                        };
                        currentValue[nestedKey].key = e.target.value;
                        handleValueChange(index, currentValue);
                      }}
                    />
                  </label>
                </div>
              ))}
              <button onClick={() => addNestedKey(index, "Nova Chave")}>
                Adicionar Nova Chave Aninhada
              </button>
            </div>
          )}
        </div>
      ))}

      <button onClick={addRootKey}>Adicionar Chave Raiz</button>
      <button onClick={handleGenerateJson}>Gerar JSON</button>

      {jsonResult && (
        <div>
          <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
          <button onClick={downloadJson}>Baixar JSON</button>
        </div>
      )}
    </div>
  );
};

export default JsonGenerator;
