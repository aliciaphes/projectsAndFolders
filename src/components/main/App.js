import "./App.css";
import { useState, useEffect } from "react";
import TopicSelector from "../TopicSelector/TopicSelector";

function App() {
  const [allTopics, setAllTopics] = useState([]);

  const [topics] = useState(new Set());

  const [allProjectsAndFolders] = useState([]);

  const [
    projectsAndFoldersToDisplay,
    setProjectsAndFoldersToDisplay,
  ] = useState(allProjectsAndFolders);

  const addProjectOrFolderToList = (projectsOrFolders) => {
    projectsOrFolders.forEach(function (item) {
      if (!item.hasOwnProperty("folder")) {
        allProjectsAndFolders.push(item);
        if (item.topics) {
          item.topics.forEach(function (topic) {
            topics.add(topic);
          });
        }
      }
    });
  };

  const updateListByTopic = (e) => {
    const topic = e.target.value;
    if (e && topic !== "") {
      setProjectsAndFoldersToDisplay(
        allProjectsAndFolders.filter((item) =>
          item.topics ? item.topics.includes(parseInt(topic)) : false
        )
      );
    } else {
      setProjectsAndFoldersToDisplay(allProjectsAndFolders);
    }
  };
  const getProjectsAndFolders = (json) => {
    // show only projects and folders that are not inside a folder
    addProjectOrFolderToList(json.projects);
    addProjectOrFolderToList(json.folders);
    setAllTopics(json.topics);

    setProjectsAndFoldersToDisplay(allProjectsAndFolders);

    // sort in descending order:
  };

  const getData = () => {
    fetch("sample_data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        getProjectsAndFolders(json);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      {projectsAndFoldersToDisplay.length > 0 ? (
        <div>
          <header className="App-header">Projects and folders</header>
          <TopicSelector
            allTopics={allTopics}
            topics={topics}
            onSelectTopic={updateListByTopic}
          />
          {projectsAndFoldersToDisplay.map((d) => (
            <>
              <div>{d.title}</div>
              <div>{d.description}</div>
              <div>{d.started}</div>
            </>
          ))}
        </div>
      ) : (
        <p>Loading... </p>
      )}
    </div>
  );
}

export default App;
