import { useState, useRef, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";

const AutocompleteTags = ({
  value,
  onChange,
  name,
  suggestions = [],
  onBlurAdd = true,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isClickingOnDropdown, setIsClickingOnDropdown] = useState(false);
  const inputRef = useRef(null);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  );

  const handleAddTag = (tag) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue(""); // Clear input value and reset focus
    const inputEl = inputRef.current.children[0].querySelector("input");

    if (inputEl) {
      inputEl.value = "";
    //   inputRef.current.children[0].click();
      inputEl.click();

      // inputRef.click(); // Focus input field when suggestions are exhausted
    }
  };

  return (
    <div
      ref={inputRef} // Attach ref to input field
      style={{ position: "relative" }}
    >
      <TagsInput
        value={value}
        onChange={onChange}
        name={name}
        onBlur={(e) => {
          if (!isClickingOnDropdown && onBlurAdd) {
            const tag = e.target.value.trim();
            handleAddTag(tag);
          }
        }}
        isEditOnRemove={true}
        onKeyUp={(e) => {
          setInputValue(e.target.value);
        }}
        onFocus={(e) => setInputValue(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {inputValue && filteredSuggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            marginTop: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "#fff",
            position: "absolute",
            zIndex: 1000,
            width: "100%",
          }}
          onMouseDown={() => setIsClickingOnDropdown(true)}
          onMouseUp={() => setIsClickingOnDropdown(false)}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={() => handleAddTag(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteTags;
