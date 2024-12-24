import { useState, useRef, useEffect } from "react";
import { SNIPPETS, CURRENT_SNIPPET } from "../js/store";
import { NAME_STORAGE } from "../js/constants";
import useAtom from "../hooks/useAtom";

const InputName = ({ value, setValue, onBlur }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    const isEnterPress = (e) => {
      if (e.key === "Enter") {
        inputRef.current.blur();
      }
    };

    const inputReference = inputRef.current;
    inputReference.addEventListener("keypress", isEnterPress);

    return () => {
      inputReference.removeEventListener("keypress", isEnterPress);
    };
  }, []);

  return (
    <input
      type="text"
      className="outline-none bg-transparent border-b border-violet-500 w-32"
      placeholder="Untitled"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      ref={inputRef}
    />
  );
};

const Tab = ({ tab, currentTab, index, setCurrentTab, removeTab }) => {
  const [isEditName, setIsEditName] = useState(false);

  const [name, setName] = useState(tab?.name ?? "");

  const changeName = () => {
    let prevData = SNIPPETS.get();
    prevData.snippets[index].name = name;
    SNIPPETS.set(prevData);
    localStorage.setItem(NAME_STORAGE, JSON.stringify(prevData));
  };

  return (
    <div
      key={index}
      className={`flex items-center gap-3 rounded-t-lg font-bold select-none  ${
        currentTab === index ? "bg-black" : ""
      }`}
    >
      {isEditName ? (
        <div className="text-xs py-2 px-5">
          <InputName
            value={name}
            setValue={setName}
            onBlur={() => {
              setIsEditName(false);
              changeName();
            }}
          />
        </div>
      ) : (
        <>
          <div
            className={`text-xs py-2 pl-5 cursor-pointer ${
              index <= 0 ? "pr-5" : ""
            }`}
            onClick={() => setCurrentTab(index)}
            onDoubleClick={() => {
              setName(tab?.name ?? "");
              setIsEditName(true);
            }}
            title="Double Click to edit name"
          >
            {tab?.name ?? "Untitled"}
          </div>
          {index > 0 ? (
            <div
              className="pr-2 text-white text-[7px] cursor-pointer hover:opacity-60"
              onClick={() => removeTab(index)}
            >
              ✖
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

const TabContainer = () => {
  const [tabs] = useAtom(SNIPPETS);
  const [currentTab, setCurrentTab] = useAtom(CURRENT_SNIPPET);

  const addTab = () => {
    let prevData = SNIPPETS.get();
    prevData.snippets.push({ content: "", name: "Untitled" });
    SNIPPETS.set(prevData);
    CURRENT_SNIPPET.set(prevData.snippets.length - 1);

    localStorage.setItem(NAME_STORAGE, JSON.stringify(prevData));
  };

  const removeTab = (i) => {
    if (i > 0) {
      let prevData = SNIPPETS.get();
      prevData.snippets.splice(i, 1);
      SNIPPETS.set(prevData);
      CURRENT_SNIPPET.set(0);

      localStorage.setItem(NAME_STORAGE, JSON.stringify(prevData));
    }
  };

  return (
    <div className=" w-full flex items-end px-2  gap-2 overflow-x-auto border-b border-zinc-700 tab-container">
      {(tabs?.snippets ?? []).map((tab, index) => {
        return (
          <Tab
            tab={tab}
            index={index}
            currentTab={currentTab}
            key={index}
            setCurrentTab={setCurrentTab}
            removeTab={removeTab}
          />
        );
      })}
      <div
        className="uppercase py-1 px-3 rounded-t-lg font-bold cursor-pointer bg-black/40"
        onClick={() => addTab()}
      >
        +
      </div>
    </div>
  );
};

export default TabContainer;
