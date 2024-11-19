"use client"
import SyntaxHighlighter from "react-syntax-highlighter";
import { sunburst } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeComp = () => {
    let codeString = `
 const url = "https://localhost:3000/api/events";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {{apiKey}}",
  };
  const eventData = {
    name: "",//* required
    domain: "", //* required
    description: "",//optional
  };

  const sendRequest = async () => {
    axios
      .post(url, eventData, { headers })
      .then()
      .catch((error) => {
        console.error("Error:", error);
      });
  };`;
  return (
    <SyntaxHighlighter language="javascript" style={sunburst}>
      {codeString}
    </SyntaxHighlighter>
  );
}