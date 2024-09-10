"use client";

import { useState } from "react";

interface IHierarchy {
  [key: string]: string[] | IHierarchy;
}

const Home = () => {
  const [hierarchy, setHierarchy] = useState<IHierarchy>({});
  const [currentPath, setCurrentPath] = useState<Array<keyof IHierarchy>>([]);
  const [newLevel, setNewLevel] = useState("");
  const [newItem, setNewItem] = useState("");

  const updateHierarchy = (
    path: Array<keyof IHierarchy>,
    newNode: string | string[]
  ) => {
    const updatedHierarchy = { ...hierarchy };
    let temp = updatedHierarchy;

    console.log(temp);
    for (const key of path) {
      if (!temp[key]) {
        temp[key] = {};
      }
      temp = temp[key];
    }

    if (Array.isArray(temp)) {
      temp.push(newNode);
    } else {
      temp[newNode as string] = {};
    }

    setHierarchy(updatedHierarchy);
  };

  const handleAddLevel = () => {
    if (newLevel) {
      updateHierarchy(currentPath, newLevel);
      setNewLevel("");
    }
  };

  const handleAddItem = () => {
    if (newItem) {
      updateHierarchy(currentPath, newItem);
      setNewItem("");
    }
  };

  const goDeeper = (level: string) => {
    setCurrentPath([...currentPath, level]);
  };

  const goBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const exportJson = () => {
    const json = JSON.stringify(hierarchy, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hierarchy.json";
    link.click();
  };

  const renderHierarchy = (node: IHierarchy, path: string[] = []) => {
    return Object.keys(node).map((key) => {
      const newPath = [...path, key];
      return (
        <div key={key} style={{ marginLeft: "20px" }}>
          <div
            onClick={() => goDeeper(key)}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            {key}
          </div>
          {Array.isArray(node[key])
            ? node[key].map((item: string) => (
                <div key={item} style={{ marginLeft: "20px" }}>
                  {item}
                </div>
              ))
            : renderHierarchy(node[key], newPath)}
        </div>
      );
    });
  };

  return (
    <div>
      <h1>Gerador de Hierarquia Personalizada</h1>

      {currentPath.length > 0 && (
        <div>
          <button onClick={goBack}>Voltar</button>
          <span> Nível Atual: {currentPath.join(" > ")}</span>
        </div>
      )}

      <div>
        <input
          placeholder="Nome do nível"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
        />
        <button onClick={handleAddLevel}>Adicionar Nível</button>
      </div>

      <div>
        <input
          placeholder="Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={handleAddItem}>Adicionar Item</button>
      </div>

      <h2>Hierarquia</h2>
      <pre>{renderHierarchy(hierarchy)}</pre>

      <button onClick={exportJson}>Exportar como JSON</button>
    </div>
  );
};

export default Home;
